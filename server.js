require('dotenv').config();
const express = require('express');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT;

const client = new pg.Client(process.env.DATABASE_URL);
client.on('err', err => {throw err;});

// app.get('/', (req, res) => {
//   res.status(200).json();
// });

app.get('/location', (req, res) => {
  let cityName = req.query.city;
  let longitude = req.query.longitude;
  let latitude = req.query.latitude;
  let SQL = 'INSERT INTO cities (city_name, latitude, longitude) VALUES ($1, $2, $3) RETURNING *';
  let safeValues = [cityName, longitude, latitude];
  client.query(SQL, safeValues)
  .then( results => {
    res.status(200).json(results);
  })
  .catch( err => console.error(err));
});


client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on ${PORT}`);
    })
  })
  .catch(err => {
    throw `PG startup error ${err.message}`
  })