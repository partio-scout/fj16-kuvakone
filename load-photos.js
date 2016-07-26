import * as dbUtils from './src/server/db';
import * as flickrUtis from './src/server/flickrutils';
import Promise from 'bluebird';
import Flickr from 'flickrapi';

const flickrOptions = {
  api_key: process.env.FLICKR_ACCESS_TOKEN,
  secret: process.env.FLICKR_ACCESS_TOKEN_SECRET,
};
const flickrTokenOnly = Promise.promisify(Flickr.tokenOnly);

flickrTokenOnly(flickrOptions)
.tap(() => console.log('Fetching photos'))
.tap(flickr => flickrUtis.getPublicPhotos(flickr)
  .then(photos => dbUtils.upsertPhotos(photos)))          // update photos
.tap(() => console.log('Fetching photosets'))
.tap(flickr => flickrUtis.getPhotoSets(flickr)
  .then(photosets => dbUtils.upsertPhotosets(photosets))) // update photosets
.tap(() => console.log('Fetching photoset mappings'))
.tap(flickr => flickrUtis.getPhotoSetPhotoIds(flickr)
  .then(photoIds => dbUtils.reCreatePhotosetPhotos(photoIds)))   // map photos to photosets
.then(() => { console.log('Done'); process.exit(0); }, err => { console.err(err); process.exit(1); });

