var cityInputEl = document.getElementById("city-name");
var searchEl = document.getElementById("search-button");
var historyEl = document.getElementById("history");
var currWeatherEl = document.getElementById("current-forecast-container");
var cityNameEl = document.getElementById("searched-city");
var currWeatherImgEl = document.getElementById("current-weather-img");
var currTempEl = document.getElementById("current-temperature");
var currWindEl = document.getElementById("current-wind-speed");
var currHumidityEl = document.getElementById("current-humidity");
var currUVEl = document.getElementById("current-UV-index");
var uviEl = document.getElementById("uvindex");
var fiveDayTitleEl = document.getElementById("five-title");
var fiveDayEl = document.getElementById("future-container");

var getCurrWeather = function (cityName) {
    var apiKey = "cbdbbe78f7df51461b16d1ad2996a690";
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                displayCurrWeather(data);
            })
        })
};

var displayCurrWeather = function (weatherInfo) {
    currWeatherEl.classList.add("border");
    cityNameEl.textContent = weatherInfo.name + " (" + moment(weatherInfo.dt.value).format("MMM D, YYYY") + ") ";
    currWeatherImgEl.setAttribute("src", `https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`);
    currWeatherImgEl.setAttribute("alt", weatherInfo.weather[0].description);
    currWeatherImgEl.height = 75;
    currWeatherImgEl.width = 75;
    currTempEl.textContent = "Temperature: " + kelvinToFarenheit(weatherInfo.main.temp) + "°F";
    currWindEl.textContent = "Humidity: " + weatherInfo.main.humidity + "%";
    currHumidityEl.textContent = "Wind Speed: " + weatherInfo.wind.speed + " MPH";
    var lat = weatherInfo.coord.lat;
    var lon = weatherInfo.coord.lon;
    getUv(lat, lon);
}

var getUv = function (lat, lon) {
    var apiKey = "cbdbbe78f7df51461b16d1ad2996a690";
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;

    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                let uviEl = document.createElement("span");
                if (data.value < 4) {
                    uviEl.setAttribute("class", "badge bg-success");
                } else if (data.value < 8) {
                    uviEl.setAttribute("class", "badge bg-warning");
                } else {
                    uviEl.setAttribute("class", "badge bg-danger");
                }
                uviEl.textContent = data.value;

                currUVEl.innerHTML = "UV Index: ";
                currUVEl.appendChild(uviEl);
            })
        })
}

var kelvinToFarenheit = function (Kel) {
    return Math.floor(1.8 * (Kel - 273) + 32);
}

var getFiveForecast = function (cityName) {
    var apiKey = "cbdbbe78f7df51461b16d1ad2996a690";
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`;

    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                displayFiveForecast(data);
            })
        })
}

var displayFiveForecast = function (forecastInfo) {
    fiveDayEl.textContent = "";
    fiveDayTitleEl.textContent = "5-Day Forecast:";

    var forecast = forecastInfo.list;
    for (var i = 4; i < forecast.length; i += 8) {
        var dayForecast = forecast[i];

        var forecastEl = document.createElement("div");
        forecastEl.classList = "card bg-primary text-light m-2 p-2 col-2";

        var forecastDate = document.createElement("h5");
        forecastDate.textContent = moment.unix(dayForecast.dt).format("MMM D, YYYY");
        forecastEl.appendChild(forecastDate);

        var forecastWeatherImg = document.createElement("img")
        forecastWeatherImg.height = 100;
        forecastWeatherImg.width = 100;
        forecastWeatherImg.setAttribute("src", `https://openweathermap.org/img/wn/${dayForecast.weather[0].icon}@2x.png`);
        forecastEl.appendChild(forecastWeatherImg);

        var forecastTempEl = document.createElement("span");
        forecastTempEl.textContent = "Temp: " + dayForecast.main.temp + " °F";
        forecastEl.appendChild(forecastTempEl);

        var forecastWindEl = document.createElement("span");
        forecastWindEl.textContent = "Wind: " + dayForecast.wind.speed + " MPH";
        forecastEl.appendChild(forecastWindEl);

        var forecastHumEl = document.createElement("span");
        forecastHumEl.textContent = "Humidity: " + dayForecast.main.humidity + "  %";
        forecastEl.appendChild(forecastHumEl);

        fiveDayEl.appendChild(forecastEl);
    }
}

var saveSearch = function (cityName) {
    if (localStorage.getItem('cityHistory' ) == null) {
        localStorage.setItem('cityHistory', '[]');
    }
    var oldHistory = JSON.parse(localStorage.getItem('cityHistory'));
    oldHistory.unshift(cityName);

    localStorage.setItem('cityHistory', JSON.stringify(oldHistory));
};

var displayHistory = function () {
    historyEl.innerHTML = "";
    var cityArr = JSON.parse(localStorage.getItem('cityHistory'));
    if (cityArr.length > 8) {
        for (var i = 0; i < 8; i++) {
            pastSearchEl = document.createElement("button");
            pastSearchEl.textContent = cityArr[i];
            pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
            pastSearchEl.setAttribute("data-city", cityArr[i])
            pastSearchEl.setAttribute("type", "submit");
            historyEl.prepend(pastSearchEl);
        }
    } else {
        for (var i = 0; i < cityArr.length; i++) {
            pastSearchEl = document.createElement("button");
            pastSearchEl.textContent = cityArr[i];
            pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
            pastSearchEl.setAttribute("data-city", cityArr[i])
            pastSearchEl.setAttribute("type", "submit");
            historyEl.prepend(pastSearchEl);
        }
    }
}

historyEl.addEventListener("click",  function(event) {
    var city = event.target.getAttribute("data-city")
    getCurrWeather(city);
    getFiveForecast(city);
})

searchEl.addEventListener("click", function () {
    const citySearched = cityInputEl.value;
    getCurrWeather(citySearched);
    getFiveForecast(citySearched);
    cityInputEl.value = "";
    saveSearch(citySearched);
    displayHistory();
})