// HTML elements
var previousSearchesEl = document.getElementById("previousSearches");
var searchInputEl = document.getElementById("searchInput");
var searchButtonEl = document.getElementById("searchButton");

var searchedCityEl = document.getElementById("searchedCity");
var tempEl = document.getElementById("temp");
var humidityEl = document.getElementById("humidity");
var windSpeedEl = document.getElementById("windSpeed");
var uvEl = document.getElementById("uv");
var forecastTitleEl = document.getElementById("forecastTitle");
var forcastWeatherEl = document.getElementById("forecastWeather");




// loads when submit button is clicked, obtains value
var searchSubmitHandler = function(event) {
    //prevents page from reloading automatically
    event.preventDefault();
};

// calls city weather apt
var callCityWeather = function(lat, lon) {
    // open weather one call api
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=914d3b53de5d88e879e5979ff877074b&units=imperial";


    fetch(apiURL).then(function(reponse) {
        if (reponse.ok) {
            reponse.json().then(function(data) {
                displayWeather(data);
            });
        } else {
            alert("City not found. Try again.");
        };
    });
};

// converts city name to lat lon
var cityLatLon = function(cityName) {
    var city = cityName;

    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=914d3b53de5d88e879e5979ff877074b";
    
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(location) {                
                var lat = location[0].lat;
                var lon = location[0].lon;

                getCityWeather(lat, lon);    
            })
        } else {
            alert("City not found. Try again.");
        };
    });
};

// displays searched city weather onto page
var displayWeather = function(display) {
    // page content
    searchedCityEl.textContent = "";
    tempEl.textContent = "Temp: " + weather.current.temp + " ºF";
    humidityEl.textContent = "Humidity: " + weather.current.humidity + "%";
    windSpeedEl.textContent = "Wind: " + weather.current.wind_speed + " MPH";
    uvEl.textContent = "UV: " + weather.current.uvi;

    // todays date
    currentDate.textContent = new Date((weather.current.dt)*1000).toLocaleString("en-US");
    // weather icon
    var icon = document.createElement("img");
    icon.src = "https://openweathermap.org/img/wn/" + weather.current.weather[0].icon + "@2x.png";

    // clears forcast
    forcastWeatherEl.textContent = "";
    for (var i = 1; i < 6; i++) {
        forcastWeatherEl.classList = "col blue lighten-5";
    }
}

searchButtonEl.addEventListener("click", searchSubmitHandler);