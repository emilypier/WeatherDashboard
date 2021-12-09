var searchButtonEl = document.querySelector("#search-button");
var cityInputEl = document.querySelector("#city-input");
var currentWeatherContainer =  document.getElementById('currentWeather')

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
    console.log("content cleared");
  }
  else {
    alert("Please enter a valid city.");
  }
}

//get city's coordinates getTodayWeather function
var getCoordinates = function(cityName) {
  var cityCoordinates = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=a8bab6393759582134a19e65e0844b91";

  console.log("made it to getCoordinates")
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
  // console.log(weatherData);
  var cityLat = weatherData.coord.lat;
  var cityLong = weatherData.coord.lon;
  var cityName = weatherData.name;
  var todayWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLong + "&exclude=hourly,minutely&units=imperial&appid=a8bab6393759582134a19e65e0844b91";

  fetch(todayWeather).then(function(response) {
    if(response.ok) {
      return response.json()
      }else {
      alert("Error. Cannot find coordinates");
    }
    }).then(function(data) {
      createCurrentWeather(data.current, cityName)
    }).catch(function (error) {
    alert("unable to connect to API");
    console.log(error);
  });
};

function createCurrentWeather(currentWeather, city){
console.log(currentWeather)
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
cardBody.setAttribute('class', 'card-body')
card.append(cardBody);

cardTitle.setAttribute('class', 'card-title')
tempEl.setAttribute('class', 'card-text');
windEl.setAttribute('class', 'card-text');
humidEl.setAttribute('class', 'card-text');
uviEl.setAttribute('class', 'card-text');

cardTitle.textContent = city + "(call date in here) ";
imgEl.setAttribute('src', icon);
cardTitle.append(imgEl);

tempEl.textContent = 'Temp: ' + temp;
windEl.textContent = 'Wind: ' + windSpeed;
humidEl.textContent = 'Humidity: ' + humidity; 
uviEl.textContent = 'UV Index: ' + uvIndex;

cardBody.append(cardTitle, tempEl, windEl, humidEl, uviEl)

currentWeatherContainer.innerHTML = '';
currentWeatherContainer.append(card)

}


//get 5 day forecast
var getFiveDay = function() {
  fiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=a8bab6393759582134a19e65e0844b91";

  fetch(fiveDay).then(function() {
    if(response.ok) {
      response.json().then(function (data) {
        console.log("here is the 5 day forecast: " + data)
      });
    }
    else {
      alert("Error. No response from API.");
    }
  }).catch(function (error) {
    alert("unable to connect to API");
    console.log(error);
  });
}



// add event listener to search button
searchButtonEl.addEventListener("click", buttonClickHandler);
