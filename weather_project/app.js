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
    var cloudImg = cityWeather.querySelector('.img')
    cityInput.focus();

    function ucFirstAllWords(str) {
        var pieces = str.split(" ");
        for (var i = 0; i < pieces.length; i++) {
            var j = pieces[i].charAt(0).toUpperCase();
            pieces[i] = j + pieces[i].substr(1);
        }
        return pieces.join(" ");
    }

    cityForm.addEventListener('submit', function (event) { // this line changes
        event.preventDefault(); // prevent the form from submitting

        // This code doesn't change!
        var city = ucFirstAllWords(cityInput.value);

        cityInput.value = '';

        //setting default value during loading
        cityWeather.innerText = `Loading...`;

        getCoordinatesForCity(city)
            .then(getCurrentWeather)
            .then(function (weather) {
                cityWeather.innerText =
                    `Current temperature for ${city}: ${weather.temperature} C
                     Cloud condition:  ${weather.icon}
                     Wind speed:  ${weather.windSpeed} km/h` ;
            })
            .catch(() => {
                if (!navigator.onLine) {
                    cityWeather.innerText = `Check your internet connection 
                                             You seem to be offline`;
                }
                else {
                    cityWeather.innerText = `Ooops... something went wrong  
                                             Please try again later`;
                }
            })
    })
})();
