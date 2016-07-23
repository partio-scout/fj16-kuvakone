import express from 'express';
import Promise from 'bluebird';
import _ from 'lodash';
import * as dbUtils from './db';
import pg from 'pg-promise';

const Flickr = require('flickrapi');
const flickrOptions = {
  api_key: process.env.FLICKR_ACCESS_TOKEN,
  secret: process.env.FLICKR_ACCESS_TOKEN_SECRET,
};

const flickrUserId = process.env.FLICKR_USER_ID || '142180152@N04'; // Roihu2016

const app = express();
const port = process.env.PORT || 3000;
const pgp = pg();

const db = pgp(process.env.DATABASE_URL);

app.use(express.static('src/public'));

app.get('/photos',(req,res) => {
  const str = 'select title, date_taken, farm, server, secret, id, ST_X(position::geometry) as latitude, ST_Y(position::geometry) as longitude from photos where date_taken >= ${startdate} and date_taken <= ${enddate}';
  db.any(str,{ startdate:req.query.startdate || '-infinity', enddate:req.query.enddate || 'infinity' })
    .then( data => {
      const results = data.map(obj => {
        const url_tmp = `https://farm${obj.farm}.staticflickr.com/${obj.server}/${obj.id}_${obj.secret}`;
        return {
          title:obj.title,
          date:obj.date_taken,
          latitude:obj.latitude,
          longitude:obj.longitude,
          large:`${url_tmp}_h.jpg`,
          thumbnail:`${url_tmp}_q.jpg`,
        };
      });
      res.json(results);
    })
    .catch( error => {res.send(error);console.log(error);});
});

app.get('/loadPhotos', (req, response) => {
  const photosPerPage = 50;
  let flickr;
  Flickr.tokenOnly(flickrOptions, (error, flickrApp) => {
    flickr = flickrApp;
    getPublicPhotos()
    .then(photos => dbUtils.upsertPhotos(photos))          // update photos
    .then(() => getPhotoSets())
    .then(photosets => dbUtils.upsertPhotosets(photosets)) // update photosets
    .then(() => getPhotoSetPhotoIds())
    .then(photoIds => dbUtils.reCreatePhotosetPhotos(photoIds))   // map photos to photosets
    .then(() => response.send('OK'))
    .catch(e => console.error(e));
  });

  function getPublicPhotosPage(page) {
    return Promise.fromCallback(callback => flickr.people.getPublicPhotos({
      user_id: flickrUserId,
      page: page || 1,
      extras: 'geo, date_taken',
      per_page: photosPerPage,
    }, callback));
  }

  function getPublicPhotos() {
    return getPhotosCount()
    .then(countPage => Math.ceil(countPage.photos.total / photosPerPage))
    .then(pagesToGet => Promise.all(_.map(_.range(1, pagesToGet + 1), pageNum =>
      getPublicPhotosPage(pageNum)
        .then(page => page.photos.photo)
      )))
    .then(x => _.flattenDeep(x));
  }

  function getPhotosCount() {
    return Promise.fromCallback(callback =>
      flickr.people.getPublicPhotos({
        user_id: flickrUserId,
        page: 1,
        per_page: 1,
      }, callback));
  }

  function getPhotoSets() {
    return Promise.fromCallback(callback =>
      flickr.photosets.getList({
        user_id: flickrUserId,
        per_page: 500,
      }, callback));
  }

  function getPhotoSetPhotoIds() {
    return dbUtils.getPhotosetIds()
    .then(photosetIds => Promise.all(_.map(photosetIds, photosetId =>
      getPhotoSetPhotoCount(photosetId)
      .then(page => Math.ceil(page.photoset.total / photosPerPage))
      .then(pagesToGet =>
        Promise.all(_.map(_.range(1, pagesToGet + 1), pageNum =>
          getPhotoSetPhotoPage(photosetId, pageNum)
          .then(page => _.map(page.photoset.photo, p => p.id))
        )))
      .then(photoIds => ({ photosetId: photosetId, photos: _.flattenDeep(photoIds) }))

    )));

  }

  function getPhotoSetPhotoCount(photoSetId) {
    return Promise.fromCallback(callback =>
      flickr.photosets.getPhotos({
        user_id: flickrUserId,
        per_page: 1,
        photoset_id: photoSetId,
        page: 1,
      }, callback));
  }

  function getPhotoSetPhotoPage(photoSetId, page) {
    return Promise.fromCallback(callback =>
      flickr.photosets.getPhotos({
        user_id: flickrUserId,
        per_page: photosPerPage,
        photoset_id: photoSetId,
        page: page,
      }, callback));
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
