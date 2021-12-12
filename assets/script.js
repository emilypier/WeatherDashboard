var searchButtonEl = document.querySelector('#search-button');
var cityInputEl = document.querySelector('#city-input');
var currentWeatherContainer =  document.querySelector('#currentWeather');
var forecastContainer = document.querySelector('#forecast');
var uviEl = document.querySelector('.uvi');

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
      console.log(data);
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
var unixDate = currentWeather.dt;
var formattedDate = new Date(unixDate * 1000).toLocaleDateString("en-US"); //converting unix time to reg date

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
uviEl.setAttribute('class', 'card-text uvi');

cardTitle.textContent = city + " " + formattedDate;
imgEl.setAttribute('src', icon);
cardTitle.append(imgEl);

tempEl.textContent = 'Temp: ' + temp + " °F";
windEl.textContent = 'Wind: ' + windSpeed + " MPH";
humidEl.textContent = 'Humidity: ' + humidity + "%"; 
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

  var fiveDayForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=a8bab6393759582134a19e65e0844b91";

  fetch(fiveDayForecast).then(function(response) {
    if(response.ok) {
      return response.json()
      }
      else {
      alert("Error. No response from API.");
    }
    }).then(function(data) {
      createFiveDay(data, cityName);
      console.log(data);
    }).catch(function (error) {
      alert("unable to connect to API");
      console.log(error);
    });
  };

//displays 5 day forecast on page
function createFiveDay(forecastData, cityName){
  //loop to show only 5 daily forecasts. i=i+8 bc every 8th item in list array is a different day
  for (var i = 0; i < forecastData.list.length; i = i + 8) {

    var date = forecastData.list[i].dt_txt;
    var splitDay = date.substring(8, 10); //splits date string to get just day
    var splitMonth = date.substring(5, 7); //splits date string to get just month
    var splitYear = date.substring(2, 4); //splits date string to get just year
    var formattedDate = splitMonth + "/" + splitDay + "/" + splitYear; // formats date MM/DD/YY 
    var temp = forecastData.list[i].main.temp;
    var windSpeed = forecastData.list[i].wind.speed;
    var humidity = forecastData.list[i].main.humidity;
    var icon = 'https://openweathermap.org/img/w/' + forecastData.list[i].weather[0].icon + '.png';

    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var cardTitle = document.createElement('h4');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidEl = document.createElement('p');
    var imgEl = document.createElement('img');

    card.setAttribute('class', 'card');
    cardBody.setAttribute('class', 'card text-light bg-primary mx-2');
    card.append(cardBody);

    cardTitle.setAttribute('class', 'card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidEl.setAttribute('class', 'card-text');

    cardTitle.textContent = formattedDate;
    imgEl.setAttribute('src', icon);
    cardTitle.append(imgEl);

    tempEl.textContent = 'Temp: ' + temp + " °F";
    windEl.textContent = 'Wind: ' + windSpeed + " MPH";
    humidEl.textContent = 'Humidity: ' + humidity + "%"; 

    cardBody.append(cardTitle, tempEl, windEl, humidEl);

    forecastContainer.append(card);
    };
};

// save previously searched cities to local storage

//display previously searched cities & make into buttons

//make previously searched city buttons work


// add event listener to search button
searchButtonEl.addEventListener("click", buttonClickHandler);
