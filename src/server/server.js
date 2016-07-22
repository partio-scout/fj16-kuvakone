import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Kuvakone'));

app.listen(port, () => console.log(`Server listening on port ${port}`));
