'use strict';

require('dotenv').config();
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT;


const client = new pg.Client(process.env.DATABASE_URL);
client.on('err', err => {throw err;});

// app.get('/', (req, res) => {
//   res.status(200).json();
// });
app.get('/location', locationHandler);
app.get('/cities', citiesHandler);
// app.get('/weather', weatherHandler);
// app.get('/trails', trailsHandler);
// app.use('*', notFoundHandler);
// app.use(errorHandler);


function locationHandler (request, response) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.LOCATION_API_KEY}`;
  console.log(url);
  // const geoData = require('./data/geo.json');
  superagent.get(url)
    .then(data => {
      let locationData = new Location(request.query.data, data.body);
      response.status(200).json(locationData);
    })
    .catch(error => errorHandler(error, request, response));
 }

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;

}
app.get('/location', (req, res) => {
  let cityName = geoData.results[0].formatted_address;
  let longitude = geoData.results[0].geometry.location.lat;
  let latitude = geoData.results[0].geometry.location.lng;
  let SQL = 'INSERT INTO cities (city_name, latitude, longitude) VALUES ($1, $2, $3) RETURNING *';
  let safeValues = [cityName, longitude, latitude];
  client.query(SQL, safeValues)
  .then( results => {
    res.status(200).json(results);
  })
  .catch( err => console.error(err));
});

function citiesHandler(req, res) {
  let SQL = 'SELECT * FROM cities';
  client.query(SQL)
    .then( results => {
      res.status(200).json(results.rows);
    })
    .catch( err => console.err(err));
}


client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on ${PORT}`);
    })
  })
  .catch(err => {
    throw `PG startup error ${err.message}`
  })