const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const axios = require('axios');

const PORT = process.env.PORT || 3000;
const API_KEY = "0777605f8c68cf6590b2c6b16a93750b";


const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json()); //accepting only json data
// app.use(express.urlencoded());  //accept url encoded data


app.get('/', (req, res) => {
  res.json({
    up: '1'
  })

})

app.get('/getWeatherData', async (req, res, next) => {
  try {
    // Extract latitude and longitude from request parameters
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required in the request parameters.' });
    }

    // Make a request to OpenWeatherMap API
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        appid: API_KEY,
        units: "metric",
      },
    });

    // Send the JSON response with the data received from the API
    res.json(response.data);
    return;


  } catch (error) {

    next(error);

  }

})



app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    error: "something went wrong",
    stack: error.stack
  })
})



app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening at http://localhost:${PORT}`);
});