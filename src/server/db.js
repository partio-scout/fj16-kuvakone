import _ from 'lodash';
import Promise from 'bluebird';
import pg from 'pg-promise';

const pgp = pg();

export function insertPhotos(photos) {
  const db = pgp(process.env.DATABASE_URL);

  const template = 'INSERT INTO photos (id, owner, secret, server, farm, title, date_taken, position) VALUES ($(id), $(owner), $(secret), $(server), $(farm), $(title), $(date_taken), ST_GeographyFromText(\'SRID=4326;POINT($(lon) $(lat))\')); ';

  return db.task(t => {
    const queries = _.map(photos, photo =>
      t.none(template, {
        id: photo.id,
        owner: photo.owner,
        secret: photo.secret,
        server: photo.server,
        farm: photo.farm,
        title: photo.title,
        date_taken: photo.datetaken,
        lon: parseFloat(photo.longitude),
        lat: parseFloat(photo.latitude),
      }));

    return t.batch(queries);
  });
}

export function updatePhotos(photos) {
  const db = pgp(process.env.DATABASE_URL);

  const template = 'UPDATE photos SET owner=$(owner), secret=$(secret), server=$(server), farm=$(farm), title=$(title), date_taken=$(date_taken), position=ST_GeographyFromText(\'SRID=4326;POINT($(lon) $(lat))\') WHERE id=$(id); ';
  return db.task(t => {
    const queries = _.map(photos, photo =>
      t.none(template, {
        id: photo.id,
        owner: photo.owner,
        secret: photo.secret,
        server: photo.server,
        farm: photo.farm,
        title: photo.title,
        date_taken: photo.datetaken,
        lon: parseFloat(photo.longitude),
        lat: parseFloat(photo.latitude),
      }));

    return t.batch(queries);
  });
}

export function deletePhotos(idsToDelete) {
  const db = pgp(process.env.DATABASE_URL);

  if (!idsToDelete || _.isEmpty(idsToDelete)) {
    return Promise.resolve();
  } else {
    const template = 'DELETE FROM photos WHERE id IN (${toDelete:csv})';
    return db.none(template, { toDelete: idsToDelete || null });
  }
}

export function upsertPhotos(photos) {
  const db = pgp(process.env.DATABASE_URL);

  return db.query('SELECT id FROM photos;')
  .then(ids => _.map(ids, id => id.id))
  .then(ids => {
    const toCreate = _.filter(photos, photo => (!_.includes(ids, photo.id)));
    const toUpdate = _.filter(photos, photo => (_.includes(ids, photo.id)));
    const toDelete = _.difference(ids, _.map(photos, p => p.id));

    return Promise.join(
      insertPhotos(toCreate),
      updatePhotos(toUpdate),
      deletePhotos(toDelete)
    );
  });
}

export function insertPhotosets(photosets) {
  const db = pgp(process.env.DATABASE_URL);

  const template = 'INSERT INTO photosets (id, title) VALUES ($(id), $(title)); ';

  return db.task(t => {
    const queries = _.map(photosets, photoset =>
      t.none(template, {
        id: photoset.id,
        title: photoset.title._content,
      })
    );

    return t.batch(queries);
  });
}

export function updatePhotosets(photosets) {
  const db = pgp(process.env.DATABASE_URL);

  const template = 'UPDATE photosets SET title=$(title) WHERE id=$(id); ';

  return db.task(t => {
    const queries = _.map(photosets, photoset =>
      t.none(template, {
        id: photoset.id,
        title: photoset.title._content,
      })
    );

    return t.batch(queries);
  });
}

export function upsertPhotosets(photosets) {
  photosets = photosets.photosets.photoset;
  getPhotosetIds()
  .then(ids => {
    const toCreate = _.filter(photosets, photoset => (!_.includes(ids, photoset.id)));
    const toUpdate = _.filter(photosets, photoset => (_.includes(ids, photoset.id)));

    return Promise.join(
      insertPhotosets(toCreate),
      updatePhotosets(toUpdate)
    );
  });
}

export function getPhotosetIds() {
  const db = pgp(process.env.DATABASE_URL);

  return db.query('SELECT id from photosets;')
  .then(ids => _.map(ids, id => id.id));
}

export function reCreatePhotosetPhotos(photosetPhotos) {
  const db = pgp(process.env.DATABASE_URL);

  const template = 'INSERT INTO photoset_photos (photo_id, photoset_id) VALUES ($(photo_id), $(photoset_id))';
  return db.none('TRUNCATE photoset_photos;')
    .then(() => db.task(t => {
      const queries = [];
      _.forEach(photosetPhotos, photoset => {
        _.forEach(photoset.photos, photoId => {
          queries.push(t.none(template, {
            photo_id: photoId,
            photoset_id: photoset.photosetId,
          }));
        });
      });
      return t.batch(queries);
    }));
}

export function searchPhotos(query) {
  const db = pgp(process.env.DATABASE_URL);

  const queryTemplate = getPhotoSelectionSql(query);
  const bounds = query.bounds || {};

  const params = {
    startdate: query.startdate || '-infinity',
    enddate: query.enddate || 'infinity',
    photosets: query.photosets ? _.split(query.photosets, ',') : null,
    north: _.toNumber(bounds.north),
    south: _.toNumber(bounds.south),
    west: _.toNumber(bounds.west),
    east: _.toNumber(bounds.east),
  };

  return db.any(queryTemplate, params)
  .then(data => _.map(data, obj => ({
    id: obj.id,
    title: obj.title,
    date: obj.date_taken,
    latitude: obj.latitude,
    longitude: obj.longitude,
    large: createFlickrPhotoUrl(obj, 'h'),
    medium: createFlickrPhotoUrl(obj),
    thumbnail: createFlickrPhotoUrl(obj, 'q'),
    photoPageUrl: createFlickrPhotoPageUrl(obj),
    photoset: obj.photoset_id,
  })));
}

function getPhotoSelectionSql(queryParameters) {
  const hasGeoData = queryParameters.bounds && queryParameters.bounds.north && queryParameters.bounds.south && queryParameters.bounds.west && queryParameters.bounds.east;

  if (queryParameters.photosets && hasGeoData) {
    return 'SELECT DISTINCT p.title as title, p.date_taken as date_taken, p.farm as farm, p.server as server, \
  p.secret as secret, p.id as id, p.owner as owner, ST_X(p.position::geometry) as longitude, ST_Y(p.position::geometry) as latitude, pp.photoset_id as photoset_id \
  FROM photos p JOIN photoset_photos pp ON p.id=pp.photo_id \
  WHERE (p.date_taken BETWEEN ${startdate} AND ${enddate}) AND (pp.photoset_id IN (${photosets:csv})) \
  AND (ST_Intersects(ST_GeographyFromText(\'SRID=4326;POLYGON((${west} ${south},${west} ${north},${east} ${north},${east} ${south}, ${west} ${south}))\'), p.position)) \
  UNION \
  SELECT DISTINCT p2.title as title, p2.date_taken as date_taken, p2.farm as farm, p2.server as server, \
  p2.secret as secret, p2.id as id, p2.owner as owner, ST_X(p2.position::geometry) as longitude, ST_Y(p2.position::geometry) as latitude, pp2.photoset_id as photoset_id \
  FROM photos p2 JOIN photoset_photos pp2 ON p2.id=pp2.photo_id \
  RIGHT OUTER JOIN photoset_group_mapping pgm ON pp2.photoset_id=pgm.photoset_id \
  WHERE (p2.date_taken BETWEEN ${startdate} AND ${enddate}) AND (pgm.group_id IN (${photosets:csv})) \
  AND (ST_Intersects(ST_GeographyFromText(\'SRID=4326;POLYGON((${west} ${south},${west} ${north},${east} ${north},${east} ${south}, ${west} ${south}))\'), p2.position)) \
  ORDER BY date_taken';
  } else if (queryParameters.photosets) {
    return 'SELECT DISTINCT p.title as title, p.date_taken as date_taken, p.farm as farm, p.server as server, \
  p.secret as secret, p.id as id, p.owner as owner, ST_X(p.position::geometry) as longitude, ST_Y(p.position::geometry) as latitude, pp.photoset_id as photoset_id \
  FROM photos p JOIN photoset_photos pp ON p.id=pp.photo_id \
  WHERE (p.date_taken BETWEEN ${startdate} AND ${enddate}) AND (pp.photoset_id IN (${photosets:csv})) \
  UNION \
  SELECT DISTINCT p2.title as title, p2.date_taken as date_taken, p2.farm as farm, p2.server as server, \
  p2.secret as secret, p2.id as id, p2.owner as owner, ST_X(p2.position::geometry) as longitude, ST_Y(p2.position::geometry) as latitude, pp2.photoset_id as photoset_id \
  FROM photos p2 JOIN photoset_photos pp2 ON p2.id=pp2.photo_id \
  RIGHT OUTER JOIN photoset_group_mapping pgm ON pp2.photoset_id=pgm.photoset_id \
  WHERE (p2.date_taken BETWEEN ${startdate} AND ${enddate}) AND (pgm.group_id IN (${photosets:csv})) \
  ORDER BY date_taken';
  } else if (hasGeoData) {
    return 'SELECT p.title as title, p.date_taken as date_taken , p.farm as farm, p.server as server, \
  p.secret as secret, p.id as id, p.owner as owner, ST_X(p.position::geometry) as longitude, ST_Y(p.position::geometry) as latitude \
  FROM photos p WHERE (p.date_taken BETWEEN ${startdate} AND ${enddate}) AND (ST_Intersects(ST_GeographyFromText(\'SRID=4326;POLYGON((${west} ${south},${west} ${north},${east} ${north},${east} ${south}, ${west} ${south}))\'), p.position)) \
  ORDER BY p.date_taken';
  } else {
    return 'SELECT p.title as title, p.date_taken as date_taken , p.farm as farm, p.server as server, \
  p.secret as secret, p.id as id, p.owner as owner, ST_X(p.position::geometry) as longitude, ST_Y(p.position::geometry) as latitude \
  FROM photos p WHERE (p.date_taken BETWEEN ${startdate} AND ${enddate}) \
  ORDER BY p.date_taken';
  }
}

function createFlickrPhotoUrl(photo, formatCharacter) {
  const formatPostfix = formatCharacter && `_${formatCharacter}` || '';

  return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}${formatPostfix}.jpg`;
}

function createFlickrPhotoPageUrl(photo) {
  return `https://www.flickr.com/photos/${photo.owner}/${photo.id}`;
}

export function getPhotosets() {
  const db = pgp(process.env.DATABASE_URL);

  const query = 'SELECT ps.id, ps.title, ps.title_sv, ps.title_en FROM photosets ps \
  WHERE ps.id NOT IN (SELECT DISTINCT photoset_id FROM photoset_group_mapping) \
  UNION \
  SELECT pgm.id, pgm.title, pgm.title_sv, pgm.title_en FROM photoset_group pgm';
  return db.query(query);
}
