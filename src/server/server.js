import express from 'express';
import Promise from 'bluebird';
import _ from 'lodash';

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
    .then(res => {
      response.send(res);
    });
  });

  function getPublicPhotosPage(page) {
    return Promise.fromCallback(callback => flickr.people.getPublicPhotos({
      user_id: flickrUserId,
      page: page || 1,
    }, callback));
  }

  function getPublicPhotos() {
    return new Promise((resolve, reject) => {
      const photos = [];
      let pagesToGet;
      getPhotosCount()
      .then(photosCount => pagesToGet = Math.ceil(photosCount / 100))
      .then(() => {
        console.log('pages to get', pagesToGet);
        const pagePromises = [];
        for (let i = 1; i <= pagesToGet; i++) {
          pagePromises.push(getPublicPhotosPage(i)
          .then(page => _.forEach(page.photos, photo => photos.push(photo))));
        };
        Promise.all(pagePromises).then(() => resolve(photos));
      });
    });
  }

  function getPhotosCount() {
    return new Promise((resolve, reject) => {
      flickr.people.getPublicPhotos({
        user_id: flickrUserId,
        page: 1,
        per_page: 1,
      }, (err, res) => {
        if (err) reject(err);
        else resolve(res.photos.total);
      });
    });
  }

});

app.listen(port, () => console.log(`Server listening on port ${port}`));
