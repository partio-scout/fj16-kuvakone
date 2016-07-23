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
  let flickr;
  Flickr.tokenOnly(flickrOptions, (error, flickrApp) => {
    flickr = flickrApp;
    getPublicPhotos()
    .then(photos => {
      return dbUtils.upsertPhotos(photos);
    })
    .then((a,b) => response.send({a,b}))
    .catch(e => console.error(e));
  });

  function getPublicPhotosPage(page) {
    return Promise.fromCallback(callback => flickr.people.getPublicPhotos({
      user_id: flickrUserId,
      page: page || 1,
      extras: 'geo, date_taken',
    }, callback));
  }

  function getPublicPhotos() {
    return new Promise((resolve, reject) => {
      const photos = [];
      let pagesToGet;
      getPhotosCount()
      .then(countPage => pagesToGet = Math.ceil(countPage.photos.total / 100))
      .then(() => {
        //console.log('pages to get', pagesToGet);
        const pagePromises = [];
        for (let i = 1; i <= pagesToGet; i++) {
          pagePromises.push(getPublicPhotosPage(i)
          .then(page => _.forEach(page.photos.photo, p => photos.push(p))));
        };
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

});

app.listen(port, () => console.log(`Server listening on port ${port}`));
