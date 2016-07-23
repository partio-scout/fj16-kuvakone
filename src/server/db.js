const pgp = require('pg-promise')();
import _ from 'lodash';
import Promise from 'bluebird';

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
        lon: photo.longitude,
        lat: photo.latitude,
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
        lon: photo.longitude,
        lat: photo.latitude,
      }));

    return t.batch(queries);
  });
}

export function upsertPhotos(photos) {
  const db = pgp(process.env.DATABASE_URL);

  return db.query('SELECT id FROM photos;')
  .then(ids => _.map(ids, id => id.id))
  .then(ids => {
    const toCreate = _.filter(photos, photo => (ids.indexOf(photo.id) === -1));
    const toUpdate = _.filter(photos, photo => (ids.indexOf(photo.id) !== -1));

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
    const toCreate = _.filter(photosets, photoset => (ids.indexOf(photoset.id) === -1));
    const toUpdate = _.filter(photosets, photoset => (ids.indexOf(photoset.id) !== -1));

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
