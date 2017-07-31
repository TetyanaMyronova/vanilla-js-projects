var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
var DARKSKY_API_KEY = 'ce049a5702c47003b68c6125f91c05a1';
var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

var GOOGLE_MAPS_API_KEY = 'AIzaSyCC0gdpgFjdOUEDcYnAKOeUwTdeG0wQxGg';
var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

// This function returns a promise that will resolve with an object of lat/lng coordinates
function getCoordinatesForCity(cityName) {
    // This is an ES6 template string, much better than verbose string concatenation...
    var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

    return (
        fetch(url) // Returns a promise for a Response
            .then(response => response.json()) // Returns a promise for the parsed JSON (doing JSON.parse)
            .then(data => data.results[0].geometry.location) // Transform the response to only take what we need
    );
}

function getCurrentWeather(coords) {
    // Template string again! I hope you can see how nicer this is :)
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`;

    return (
        fetch(url)
            .then(response => response.json())
            .then(function(data) {
                return data.currently;
            })
    );
}

function getWeatherForCity(cityName) {
    return (
        getCoordinatesForCity(cityName)
            .then(getCurrentWeather)
    );
}

var app = document.querySelector('#app');
var cityForm = app.querySelector('.city-form');
var cityInput = cityForm.querySelector('.city-input');
var getWeatherButton = cityForm.querySelector('.get-weather-button');
var cityWeather = app.querySelector('.city-weather');

cityForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var city = cityInput.value; // Grab the current value of the input

    cityInput.value = '';
    cityWeather.innerText = `Fetching weather for ${city}`;

    getWeatherForCity(city)
        .then(function(weather) {
            cityWeather.innerText = `Current temperature for ${city}: ${weather.temperature}`;
        })
        .catch(() => {
            if (!navigator.onLine) {
                cityWeather.innerText = 'Check your internet connection. You seem to be offline';
            }
            else {
                cityWeather.innerText = 'Something went wrong. Please try again later';
            }
        })
});