import express from 'express';
import * as dbUtils from './db';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('src/public'));

app.get('/photos',(req,res) => {
  dbUtils.searchPhotos(req.query)
  .then(result => res.json(result), error => {
    res.status(500).send(error);
    console.log(error);
  });
});

app.get('/photosets', (req, res) => {
  dbUtils.getPhotosets()
  .then(ps => res.json(ps), e => {
    res.status(500).send(e);
    console.log(e);
  });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
