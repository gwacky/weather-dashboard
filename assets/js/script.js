var currentDate = moment().format("MM/DD/YYYY");
var city = document.getElementById("city");
var cityQuery = document.getElementById("citySearch");
var searchBtn = document.getElementById("searchBtn");
var temp = document.getElementById("temp");
var wind = document.getElementById("wind");
var humidity = document.getElementById("humidity");
var uvIndex = document.getElementById("uvIndex");
var forecastCards = document.getElementById("forecastCards");
var searchHistory = document.getElementById("searchHistory");

var savedCities = []
// weather api and geocord api to transcribe written location to a location on the map, and weather for that location
var geoCord = "https://api.openweathermap.org/geo/1.0/direct?limit=1&appid=be42f8237631c96e686a5fc924ebe9dd"
var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?appid=8d7a67ef47192bdaaee4e3e539a24175";

// fetches written location
function getWeather(query) {
    var url= geoCord + `&q=${query}`
    // fetches lat, lon
    fetch(url).then(function(res){
      res.json().then(function(data){
          var cityName = data[0].name
          var lat = data[0].lat
          var lon = data[0].lon
          var url= weatherApiUrl + `&lat=${lat}&lon=${lon}`
          // fetches weather for queried results, then calls displayWeather
          fetch(url).then(function(res){
              res.json().then(function(data){
                  displayWeather(data, cityName)
              })
          }).catch(function(error){
              console.log(error)
          })
      })
    }).catch(function(error){
        console.log(error)
    })

};

function displayWeather(weather, cityName){
    // current weather icon
    var icon = `https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`
    // display for current city name, temp, wind speed, humidity levels and UV index
    city.innerHTML = `${cityName} (${currentDate}) <img class="img-fluid" src="${icon}" alt="${weather.current.weather[0].description}"/>`
    temp.innerHTML = `${Math.floor((weather.current.temp-273.15) * (9/5) +32)} &#8457;`;
    wind.innerHTML = weather.current.wind_speed
    humidity.innerHTML = weather.current.humidity
    uvIndex.innerHTML = weather.current.uvi
    // color set depending on UV index data
    var colors = ["#8BD448","#8BD448", "#FAE442", "#FAE442", "#FBA949", "#FBA949", "#FF6355", "#FF6355", "#9C4F96", "#9C4F96"]
        if(weather.current.uvi<0) { 
            uvIndex.style.backgroundColor = colors[0]
        } else if(weather.current.uvi>10) {
            uvIndex.style.backgroundColor = colors[9]
        } else {
            uvIndex.style.backgroundColor = colors[Math.floor(weather.current.uvi)]
        }
    // cards displaying 5 day forecast
    var cards = weather.daily
        forecastCards.innerHTML = ""
        for(var i = 0; i<5; i++){
            var column = document.createElement("div")
            column.classList.add("col-md-auto", "col-sm-12")
            var card= document.createElement("div")
            card.classList.add("card", "bg-secondary", "text-white", "p-1", "rounded-0")
            var date = document.createElement("h4")
                date.textContent = moment(cards[i].dt, "X").format("MM/DD/YYYY");
            card.append(date)
            var img = document.createElement("img")
                img.classList.add("img-fluid", "w-25")
                img.setAttribute("src", `https://openweathermap.org/img/wn/${cards[i].weather[0].icon}@2x.png`)
                img.setAttribute("alt", cards[i].weather.description)
            card.append(img)
            var list = document.createElement("ul")
            var item = document.createElement("li")
                item.innerHTML = `Temp: ${Math.floor((cards[i].temp.max-273.15) * (9/5) +32)} &#8457;`
                list.append(item)
                item = document.createElement("li")
                item.textContent = `Wind: ${cards[i].wind_speed} MPH`
                list.append(item)
                item = document.createElement("li")
                item.textContent = `Humidity: ${cards[i].humidity} %`
                list.append(item)
            card.append(list)
            column.append(card)
            forecastCards.append(column)
        }
};

function loadSearchHistory(loadCity) {
    // creates a list element for search history to be entered
    var searchListEl = document.createElement("li");
    searchListEl.className = "search-history";
    // creates a button for each search
    var btn = document.createElement("button");
    btn.textContent = loadCity;
    btn.className = "btn btn-secondary"
    // when search history button is click, the getWeather function is called
    btn.addEventListener("click", function(){
        getWeather(loadCity)})
    searchListEl.append(btn)
    searchHistory.append(searchListEl)
};

// function that joins and adds searched city names together
function citySearch(str) {
  var words = str.split(' ');
  var titleCaseWords = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    titleCaseWords.push(word[0].toUpperCase() + word.slice(1).toLowerCase());
  }

  return titleCaseWords.join(' ');
};


function loadCity() {
    // fetches saved city searches from localstorage
    var savedCitiesJSON = localStorage.getItem("searchHistory");
    // if there are no cities, set cities to an empty array and return out of the function
    if (!savedCitiesJSON) {
      return false;
    }
    // parse into array of objects
    savedCities = JSON.parse(savedCitiesJSON);

    // loop through savedCities array
    for (var i = 0; i < savedCities.length; i++) {
      // pass each task object into the `LoadSearchHistory` function
      loadSearchHistory(savedCities[i]);
    }
};

searchBtn.addEventListener("click", function(event){
    var text = cityQuery.value
    var query = citySearch(text)
    getWeather(query)
    savedCities.push(query)
    localStorage.setItem("searchHistory", JSON.stringify(savedCities));
    loadSearchHistory(query)
});

// initiates the loadCity function
loadCity();