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

export function upsertPhotos(photos) {
  const db = pgp(process.env.DATABASE_URL);

  return db.query('SELECT id FROM photos;')
  .then(ids => _.map(ids, id => id.id))
  .then(ids => {
    const toCreate = _.filter(photos, photo => (!_.includes(ids, photo.id)));
    const toUpdate = _.filter(photos, photo => (_.includes(ids, photo.id)));

    return Promise.join(
      insertPhotos(toCreate),
      updatePhotos(toUpdate)
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

  const queryDates = 'SELECT p.title as title, p.date_taken as date_taken , p.farm as farm, p.server as server, \
  p.secret as secret, p.id as id, ST_X(p.position::geometry) as longitude, ST_Y(p.position::geometry) as latitude \
  FROM photos p WHERE (date_taken BETWEEN ${startdate} AND ${enddate}) ';

  const queryDatesPhotosets = 'SELECT p.title as title, p.date_taken as date_taken , p.farm as farm, p.server as server, \
  p.secret as secret, p.id as id, ST_X(p.position::geometry) as longitude, ST_Y(p.position::geometry) as latitude, pp.photoset_id as photoset_id \
  FROM photos p LEFT OUTER JOIN photoset_photos pp ON p.id=pp.photo_id \
  WHERE (date_taken BETWEEN ${startdate} AND ${enddate}) AND (pp.photoset_id IN (${photosets:csv}))';

  const queryTemplate = query.photosets ? queryDatesPhotosets : queryDates;
  const params = {
    startdate: query.startdate || '-infinity',
    enddate: query.enddate || 'infinity',
    photosets: query.photosets ? _.split(query.photosets, ',') : null,
  };

  return db.any(queryTemplate, params)
  .then(data => _.map(data, obj => {
    const url_tmp = `https://farm${obj.farm}.staticflickr.com/${obj.server}/${obj.id}_${obj.secret}`;
    return {
      title: obj.title,
      date: obj.date_taken,
      latitude: obj.latitude,
      longitude: obj.longitude,
      large: `${url_tmp}_h.jpg`,
      medium: `${url_tmp}.jpg`,
      square: `${url_tmp}_q.jpg`,
      photoset: obj.photoset_id,
    };
  }));
}

export function getPhotosets() {
  const db = pgp(process.env.DATABASE_URL);

  return db.query('SELECT id, title FROM photosets');
}
