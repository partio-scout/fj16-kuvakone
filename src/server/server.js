import express from 'express';
import pg from 'pg-promise';

const app = express();
const port = process.env.PORT || 3000;
var pgp = pg();

var db = pgp(process.env.DATABASE_URL);

app.get('/', (req, res) => res.send('Kuvakone'));


app.get('/kuvat',function(req,res){
  db.any("select title, date_taken, farm, server, secret, id, ST_X(position::geometry) as posx, ST_Y(position::geometry) as posy from photos", [true])
    .then(function (data) {
      var results = [];
      for (var i = 0;i<data.length;i++){
        var tmp = {};
        //construct url
        var url_tmp = "https://farm" + data[i].farm + ".staticflickr.com/" + data[i].server+"/"+data[i].id+"_"+data[i].secret;
        tmp.large = url_tmp + '_h.jpg';
        tmp.thumbnail = url_tmp + '_q.jpg';
        tmp.date = data[i].date_taken;
        tmp.title = data[i].title;
        tmp.latitude = data[i].posx;
        tmp.longitude = data[i].posy;
        results.push(tmp);
      }
      res.json(results);

    })
    .catch(function (error){
      console.log(error);
      res.send('error');
    });

});

app.listen(port, () => console.log(`Server listening on port ${port}`));
