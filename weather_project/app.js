(function () {
    var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
    var DARKSKY_API_KEY = '37f5d4285ae1e5fa0603200af1584b40';
    var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

    var GOOGLE_MAPS_API_KEY = 'AIzaSyBYpwgXEoMgnINV3nah3TMFMAJwvbbH7L4';
    var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

// This function returns a promise that will resolve with an object of lat/lng coordinates
    function getCoordinatesForCity(cityName) {
        // This is an ES6 template string, much better than verbose string concatenation...
        var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

        return (
            fetch(url) // Returns a promise for a Response
                .then(response => response.json()) // Returns a promise for the parsed JSON
                .then(data => data.results[0].geometry.location) // Transform the response to only take what we need
        );
    }

    function getCurrentWeather(coords) {
        // Template string again! I hope you can see how nicer this is :)
        var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`;

        return (
            fetch(url)
                .then(response => response.json())
                .then(data => data.currently)
        );
    }

    var app = document.querySelector('#app');
    var cityForm = app.querySelector('.city-form');
    var cityInput = cityForm.querySelector('.city-input');
    var cityWeather = app.querySelector('.city-weather');

    cityForm.addEventListener('submit', function (event) { // this line changes
        event.preventDefault(); // prevent the form from submitting

        // This code doesn't change!
        var city = cityInput.value;

        //setting default value
        cityWeather.innerText='Loading...';

        getCoordinatesForCity(city)
            .then(getCurrentWeather)
            .then(function (weather) {
                cityWeather.innerText = 'Current temperature: ' + weather.temperature + ' C'+
                    '\n Cloud condition:  '+ weather.icon +
                    '\n Wind speed:  '+ weather.windSpeed;
            });
    })
})();
