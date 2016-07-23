import express from 'express';
import pg from 'pg-promise';

const app = express();
const port = process.env.PORT || 3000;
const pgp = pg();

const db = pgp(process.env.DATABASE_URL);

app.get('/', (req, res) => res.send('Kuvakone'));

app.get('/kuvat',(req,res) => {
  db.any('select title, date_taken, farm, server, secret, id, ST_X(position::geometry) as latitude, ST_Y(position::geometry) as longitude from photos', [true])
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
