import Promise from 'bluebird';
import _ from 'lodash';
import * as dbUtils from './db';

const flickrUserId = process.env.FLICKR_USER_ID;
const photosPerPage = 500;

export function getPublicPhotosPage(flickr, page) {
  return Promise.fromCallback(callback => flickr.people.getPublicPhotos({
    user_id: flickrUserId,
    page: page || 1,
    extras: 'geo, date_taken',
    per_page: photosPerPage,
  }, callback));
}

export function getPublicPhotos(flickr) {
  return getPhotosCount(flickr)
  .then(countPage => Math.ceil(countPage.photos.total / photosPerPage))
  .then(pagesToGet => Promise.all(_.map(_.range(1, pagesToGet + 1), pageNum =>
    getPublicPhotosPage(flickr, pageNum)
      .then(page => page.photos.photo)
    )))
  .then(x => _.flattenDeep(x));
}

export function getPhotosCount(flickr) {
  return Promise.fromCallback(callback =>
    flickr.people.getPublicPhotos({
      user_id: flickrUserId,
      page: 1,
      per_page: 1,
    }, callback));
}

export function getPhotoSets(flickr) {
  return Promise.fromCallback(callback =>
    flickr.photosets.getList({
      user_id: flickrUserId,
      per_page: 500,
    }, callback));
}

export function getPhotoSetPhotoIds(flickr) {
  return dbUtils.getPhotosetIds()
  .then(photosetIds => Promise.all(_.map(photosetIds, photosetId =>
    getPhotoSetPhotoCount(flickr, photosetId)
    .then(page => Math.ceil(page.photoset.total / photosPerPage))
    .then(pagesToGet =>
      Promise.all(_.map(_.range(1, pagesToGet + 1), pageNum =>
        getPhotoSetPhotoPage(flickr, photosetId, pageNum)
        .then(page => _.map(page.photoset.photo, p => p.id))
      )))
    .then(photoIds => ({ photosetId: photosetId, photos: _.flattenDeep(photoIds) }))

  )));

}

export function getPhotoSetPhotoCount(flickr, photoSetId) {
  return Promise.fromCallback(callback =>
    flickr.photosets.getPhotos({
      user_id: flickrUserId,
      per_page: 1,
      photoset_id: photoSetId,
      page: 1,
    }, callback));
}

export function getPhotoSetPhotoPage(flickr, photoSetId, page) {
  return Promise.fromCallback(callback =>
    flickr.photosets.getPhotos({
      user_id: flickrUserId,
      per_page: photosPerPage,
      photoset_id: photoSetId,
      page: page,
    }, callback));
}
