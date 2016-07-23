import express from 'express';
import Promise from 'bluebird';
import _ from 'lodash';
import * as dbUtils from './db';

const Flickr = require('flickrapi');
const flickrOptions = {
  api_key: process.env.FLICKR_ACCESS_TOKEN,
  secret: process.env.FLICKR_ACCESS_TOKEN_SECRET,
};

const flickrUserId = process.env.FLICKR_USER_ID || '142180152@N04'; // Roihu2016

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Kuvakone'));

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
    return new Promise((resolve, reject) => {
      const photos = [];
      let pagesToGet;
      getPhotosCount()
      .then(countPage => pagesToGet = Math.ceil(countPage.photos.total / photosPerPage))
      .then(() => {
        //console.log('pages to get', pagesToGet);
        const pagePromises = [];
        for (let i = 1; i <= pagesToGet; i++) {
          pagePromises.push(getPublicPhotosPage(i)
          .then(page => _.forEach(page.photos.photo, p => photos.push(p))));
        }
        Promise.all(pagePromises).then(() => resolve(photos));
      });
    });
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
