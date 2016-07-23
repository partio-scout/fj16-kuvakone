const pgp = require('pg-promise')();
import _ from 'lodash';
import Promise from 'bluebird';

export function insertPhotos(photos) {
  const db = pgp(process.env.DATABASE_URL);

  const template = 'INSERT INTO photos (id, owner, secret, server, farm, title, date_taken, position) VALUES ($(id), $(owner), $(secret), $(server), $(farm), $(title), $(date_taken), ST_GeographyFromText(\'SRID=4326;POINT($(lon) $(lat))\')); ';

  return db.task(t => {
    const queries = _.map(photos, photo =>
      db.none(template, {
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
      db.none(template, {
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