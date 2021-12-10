var searchButtonEl = document.querySelector("#search-button");
var cityInputEl = document.querySelector("#city-input");
var currentWeatherContainer =  document.getElementById('currentWeather');
var forecastContainer = document.getElementById('forecast');

var buttonClickHandler = function(event) {
  //prevent page from refreshing
  event.preventDefault();

  //get value from input element
  var cityName = cityInputEl.value.trim();
  
  if (cityName) {
    getCoordinates(cityName);
    //clear old content from search box
    cityInputEl.textContent = "";
    cityName.value = ""; 
  }
  else {
    alert("Please enter a valid city.");
  }
}

//get city's coordinates getTodayWeather function
var getCoordinates = function(cityName) {
  var cityCoordinates = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=a8bab6393759582134a19e65e0844b91";

  fetch(cityCoordinates).then(function(response) {
    if(response.ok) {
      return response.json()
      }else {
      alert("Error. Cannot find coordinates");
    }
    }).then(function(data) {
      getTodayWeather(data)
    }).catch(function (error) {
    alert("unable to connect to API");
    console.log(error);
  });
};


//get city's weather today. "weather icon", "temp", "wind_speed", "humidity", "uvi"
var getTodayWeather = function(weatherData) {
  var cityLat = weatherData.coord.lat;
  var cityLong = weatherData.coord.lon;
  var cityName = weatherData.name;
  var todayWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLong + "&exclude=hourly,minutely&units=imperial&appid=a8bab6393759582134a19e65e0844b91";

  fetch(todayWeather).then(function(response) {
    if(response.ok) {
      return response.json()
      }
      else {
      alert("Error. Cannot find coordinates");
    }
    }).then(function(data) {
      createCurrentWeather(data.current, cityName)
    }).catch(function (error) {
    alert("unable to connect to API");
    console.log(error);
  });
};

//displays today's weather on page
function createCurrentWeather(currentWeather, city){
var temp = currentWeather.temp;
var windSpeed = currentWeather.wind_speed;
var humidity = currentWeather.humidity;
var uvIndex = currentWeather.uvi;
var icon = 'https://openweathermap.org/img/w/'+ currentWeather.weather[0].icon+'.png';

var card = document.createElement('div');
var cardBody = document.createElement('div');
var cardTitle = document.createElement('h2');
var tempEl = document.createElement('p');
var windEl = document.createElement('p');
var humidEl = document.createElement('p');
var uviEl = document.createElement('p');
var imgEl = document.createElement('img');

card.setAttribute('class', 'card');
cardBody.setAttribute('class', 'card-body');
card.append(cardBody);

cardTitle.setAttribute('class', 'card-title');
tempEl.setAttribute('class', 'card-text');
windEl.setAttribute('class', 'card-text');
humidEl.setAttribute('class', 'card-text');
uviEl.setAttribute('class', 'card-text');

cardTitle.textContent = city + "(add date here)";
imgEl.setAttribute('src', icon);
cardTitle.append(imgEl);

tempEl.textContent = 'Temp: ' + temp;
windEl.textContent = 'Wind: ' + windSpeed;
humidEl.textContent = 'Humidity: ' + humidity; 
uviEl.textContent = 'UV Index: ' + uvIndex;

cardBody.append(cardTitle, tempEl, windEl, humidEl, uviEl);

currentWeatherContainer.innerHTML = '';
currentWeatherContainer.append(card);

// // UV index color coding
// if (uvIndex < 3) { uviEl.addClass("uv-low") };
// if (uvIndex >= 3) { uviEl.addClass("uv-med") };
// if (uvIndex >= 6) { uviEl.addClass("uv-high") };
// if (uvIndex >= 8) { uviEl.addClass("uv-veryhigh") };
// if (uvIndex > 11) { uviEl.addClass("uv-extreme") };

getFiveDay(city);
}


//get 5 day forecast
function getFiveDay(cityName) {
  // var cityName = forecastData.city; 
  // var cityName = cityInputEl.value.trim();

  var fiveDayForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=a8bab6393759582134a19e65e0844b91";

  fetch(fiveDayForecast).then(function(response) {
    if(response.ok) {
      return response.json()
      }
      else {
      alert("Error. No response from API.");
    }
    }).then(function(data) {
      createFiveDay(data, cityName);
      console.log("here is the 5 day forecast");
    }).catch(function (error) {
      alert("unable to connect to API");
      console.log(error);
    });
  };

//displays 5 day forecast on page
function createFiveDay(forecastData, cityName){
var temp = forecastData.temp;
var windSpeed = forecastData.wind_speed;
var humidity = forecastData.humidity;
var icon = 'https://openweathermap.org/img/w/' + forecastData.list[0].weather[0].icon + '.png';

var card = document.createElement('div');
var cardBody = document.createElement('div');
var cardTitle = document.createElement('h2');
var tempEl = document.createElement('p');
var windEl = document.createElement('p');
var humidEl = document.createElement('p');
var imgEl = document.createElement('img');

card.setAttribute('class', 'card bg-primary');
cardBody.setAttribute('class', 'card-body col text-light m-2');
card.append(cardBody);

// cardTitle.setAttribute('class', 'card-title');
tempEl.setAttribute('class', 'card-text');
windEl.setAttribute('class', 'card-text');
humidEl.setAttribute('class', 'card-text');

cardTitle.textContent = "(call date in here)";
imgEl.setAttribute('src', icon);
cardTitle.append(imgEl);

tempEl.textContent = 'Temp: ' + temp;
windEl.textContent = 'Wind: ' + windSpeed;
humidEl.textContent = 'Humidity: ' + humidity; 

cardBody.append(cardTitle, tempEl, windEl, humidEl);

forecastContainer.append(card);
}



// add event listener to search button
searchButtonEl.addEventListener("click", buttonClickHandler);
