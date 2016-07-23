import express from 'express';
import pg from 'pg-promise';

const app = express();
const port = process.env.PORT || 3000;
const pgp = pg();

const db = pgp(process.env.DATABASE_URL);

app.get('/test/photos', (req, res) => res.json([
  {
    id: '27859607903',
    thumbnail: 'https://farm9.staticflickr.com/8191/27859607903_01b392ba0c_q.jpg',
    large: 'https://farm9.staticflickr.com/8191/27859607903_01b392ba0c_h.jpg',
    title: '20160720_NooraQvick_Rakentelu1',
    dateTaken: '2016-07-20',
    geo: { lat: '61.209260', lon: '25.116956' },
  },
  {
    id: '28442735206',
    thumbnail: 'https://farm9.staticflickr.com/8567/28442735206_b536f930b8_q.jpg',
    large: 'https://farm9.staticflickr.com/8567/28442735206_b536f930b8_h.jpg',
    title: '20160721-TuomasSauliala-Rakennusleiri_9678',
    dateTaken: '2016-07-21',
    geo: { lat: '61.206689', lon: '25.115078' },
  },
  {
    id: '28397009701',
    thumbnail: 'https://farm9.staticflickr.com/8470/28397009701_555dbaa0d5_q.jpg',
    large: 'https://farm9.staticflickr.com/8470/28397009701_555dbaa0d5_h.jpg',
    title: '20160721-TuomasSauliala-Rakennusleiri_9577',
    dateTaken: '2016-07-21',
    geo: { lat: '61.207602', lon: '25.128703' },
  },
  {
    id: '27859188003',
    thumbnail: 'https://farm9.staticflickr.com/8821/27859188003_98658490ba_q.jpg',
    large: 'https://farm9.staticflickr.com/8821/27859188003_98658490ba_h.jpg',
    title: '20160721-TuomasSauliala-Keidas-0147',
    dateTaken: '2016-07-21',
    geo: { lat: '61.202606', lon: '25.118766' },
  },
  {
    id: '28191966400',
    thumbnail: 'https://farm9.staticflickr.com/8788/28191966400_e2d2340df9_q.jpg',
    large: 'https://farm9.staticflickr.com/8788/28191966400_e2d2340df9_h.jpg',
    title: '20160721-TuomasSauliala-Keidas-0153',
    dateTaken: '2016-07-21',
    geo: { lat: '61.202606', lon: '25.118766' },
  },
  {
    id: '27854440514',
    thumbnail: 'https://farm9.staticflickr.com/8670/27854440514_5a63a1ce38_q.jpg',
    large: 'https://farm9.staticflickr.com/8670/27854440514_5a63a1ce38_h.jpg',
    title: '20160722_NooraQvick_Globaalilaakso_017',
    dateTaken: '2016-07-22',
    geo: { lat: '61.206315', lon: '25.112999' },
  },
  {
    id: '28396600361',
    thumbnail: 'https://farm8.staticflickr.com/7660/28396600361_2c7cc1fc7f_q.jpg',
    large: 'https://farm8.staticflickr.com/7660/28396600361_2c7cc1fc7f_h.jpg',
    title: '20160721_JanneSeppänen_Leirihotelli_002',
    dateTaken: '2016-07-21',
    geo: { lat: '61.204638', lon: '25.118227' },
  },
]));

app.use(express.static('src/public'));

app.get('/photos',(req,res) => {
  db.any('select title, date_taken, farm, server, secret, id, ST_X(position::geometry) as latitude, ST_Y(position::geometry) as longitude from photos')
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
    .catch( error => res.send('error'));

});

app.listen(port, () => console.log(`Server listening on port ${port}`));
