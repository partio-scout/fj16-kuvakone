import express from 'express';
import * as dbUtils from './db';
import * as flickrUtis from './flickrutils';
import Promise from 'bluebird';

const Flickr = require('flickrapi');
const flickrOptions = {
  api_key: process.env.FLICKR_ACCESS_TOKEN,
  secret: process.env.FLICKR_ACCESS_TOKEN_SECRET,
};

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('src/public'));

app.get('/photos',(req,res) => {
  dbUtils.searchPhotos(req.query)
  .then(result => res.json(result))
  .catch(error => {
    res.send(error);
    console.log(error);
  });
});

app.get('/loadPhotos', (req, response) => {
  const flickrTokenOnly = Promise.promisify(Flickr.tokenOnly);

  flickrTokenOnly(flickrOptions)
  .tap(flickr => flickrUtis.getPublicPhotos(flickr)
    .then(photos => dbUtils.upsertPhotos(photos)))          // update photos
  .tap(flickr => flickrUtis.getPhotoSets(flickr)
    .then(photosets => dbUtils.upsertPhotosets(photosets))) // update photosets
  .tap(flickr => flickrUtis.getPhotoSetPhotoIds(flickr)
    .then(photoIds => dbUtils.reCreatePhotosetPhotos(photoIds)))   // map photos to photosets
  .then(() => response.send('OK'))
  .catch(e => console.error(e));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
