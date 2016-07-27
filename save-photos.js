import { getPhotoInfoAWS } from './src/server/db';
import knox from 'knox';
import _ from 'lodash';
import Promise from 'bluebird';
import request from 'superagent';

const client = knox.createClient({
  key: process.env.AWS_SECRET_KEY_ID,
  secret: process.env.AWS_SECRET_ACCESS_KEY,
  bucket: 'kuvakone-dev',
});

const putStreamAWS = Promise.promisify(client.putStream);

getPhotoInfoAWS()
.then(photoinfo => Promise.all(_.map(photoinfo, photo =>
  Promise.join(
    putImage(photo.medium, photo.name_medium),
    putImage(photo.large, photo.name_large),
    putImage(photo.thumbnail, photo.name_thumbnail)
  )
)))
.then(() => {
  console.log('Done');
  process.exit(0);
})
.catch(err => {
  console.log(err);
  process.exit(1);
});

function putImage(url, filename) {
  return request.get(url).end((err, res) => {

    var headers = {
      'Content-Length': res.headers['content-length'],
      'Content-Type': res.headers['content-type'],
    };
    return putStreamAWS(res, `/${filename}`, headers)
    .then(result => {
      //
    });
  });
}
