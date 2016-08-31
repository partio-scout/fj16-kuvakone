import * as dbUtils from './src/server/db';
import * as flickrUtis from './src/server/flickrutils';
import { photosetGroups } from './src/server/photosetGroups';
import Promise from 'bluebird';
import Flickr from 'flickrapi';

const flickrOptions = {
  api_key: process.env.FLICKR_ACCESS_TOKEN,
  secret: process.env.FLICKR_ACCESS_TOKEN_SECRET,
};
const flickrTokenOnly = Promise.promisify(Flickr.tokenOnly);

flickrTokenOnly(flickrOptions)
.tap(() => console.log('Fetching photos'))
.tap(() => dbUtils.truncatePhotosetMappings())
.tap(flickr => flickrUtis.getPublicPhotos(flickr)
  .then(photos => dbUtils.upsertPhotos(photos)))
.tap(() => console.log('Fetching photosets'))
.tap(flickr => flickrUtis.getPhotoSets(flickr)
  .then(photosets => dbUtils.upsertPhotosets(photosets)))
.tap(() => console.log('Fetching photoset mappings'))
.tap(flickr => flickrUtis.getPhotoSetPhotoIds(flickr)
  .then(photoIds => dbUtils.reCreatePhotosetPhotos(photoIds)))
.tap(() => console.log('Recreating photoset groups'))
.tap(() => dbUtils.recreatePhotosetGroupMappings(photosetGroups))
.then(() => { console.log('Done'); process.exit(0); }, err => { console.error(err); process.exit(1); });
