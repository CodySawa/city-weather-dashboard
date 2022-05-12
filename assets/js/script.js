const cityInputEl = document.getElementById("city-name")
const searchEl = document.getElementById("search-button")
const historyEl = document.getElementById("history")
const currWeatherEl = document.getElementById("current-forecast-container")
const cityNameEl = document.getElementById("searched-city")
const currWeatherImgEl = document.getElementById("current-weather-img")
const currTempEl = document.getElementById("current-temperature")
const currWindEl = document.getElementById("current-wind-speed")
const currHumidityEl = document.getElementById("current-humidity")
const currUVEl = document.getElementById("current-UV-index")
const uvi = document.getElementById("uvindex")
const fiveDayEl = document.getElementById("future-container")

var getCurrWeather = function (cityName) {
    var apiKey = "cbdbbe78f7df51461b16d1ad2996a690"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`

    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                displayCurrWeather(data)
                console.log(data)
            });
        });
};

var displayCurrWeather = function (weatherInfo) {
    currWeatherEl.classList.add("border")
    cityNameEl.textContent = weatherInfo.name + " (" + moment(weatherInfo.dt.value).format("MMM D, YYYY") + ") "
    currWeatherImgEl.setAttribute("src", `https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`)
    currWeatherImgEl.setAttribute("alt", weatherInfo.weather[0].description)
    currWeatherImgEl.height = 75
    currWeatherImgEl.width = 75
    currTempEl.textContent = "Temperature: " + kelvinToFarenheit(weatherInfo.main.temp) + "°F"
    currWindEl.textContent = "Humidity: " + weatherInfo.main.humidity + "%";
    currHumidityEl.textContent = "Wind Speed: " + weatherInfo.wind.speed + " MPH";
    var lat = weatherInfo.coord.lat;
    var lon = weatherInfo.coord.lon;
    getUv(lat, lon)
}

var getUv = function(lat, lon) {
    var apiKey = "cbdbbe78f7df51461b16d1ad2996a690"
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`

    fetch(apiURL)
        .then(function(response) {
            response.json().then(function(data) {
                console.log(data)
                let uvi = document.createElement("span")
                if (data.value < 4) {
                    uvi.setAttribute("class", "badge bg-success")
                } else if (data.value < 8) {
                    uvi.setAttribute("class", "badge bg-warning")
                } else {
                    uvi.setAttribute("class", "badge bg-danger")
                }
                console.log(data.value);
                uvi.textContent = data.value;

                currUVEl.innerHTML = "UV Index: "
                currUVEl.appendChild(uvi)
            });
        });
}

var kelvinToFarenheit = function (Kel) {
    return Math.floor(1.8 * (Kel - 273) + 32)
}

searchEl.addEventListener("click", function () {
    const citySearched = cityInputEl.value
    if (citySearched) {
        getCurrWeather(citySearched)
    } else {
        alert("Enter a valid city name")
    }
})