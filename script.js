require("dotenv").config();
const apiKey = process.env.API_KEY;
console.log("API Key:", apiKey);
// Ana hava durumu fonksiyonu
function getWeather() {
  const city = document.getElementById("city").value;

  // Şehir boşsa kullanıcıyı uyarır
  if (!city) {
    showError("Please enter a city");
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  // Mevcut hava durumu verisini çeker
  fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data);
    })

    // Hata durumunda konsola yazdırır ve kullanıcıyı bilgilendirir
    .catch((error) => {
      console.error("Error fetching current weather data:", error);
      showError("Error fetching current weather data. Please try again.");
    });

  // Saatlik hava tahmini verisini çeker
  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      displayHourlyForecast(data.list);
    })
    .catch((error) => {
      console.error("Error fetching hourly forecast data:", error);
      showError("Error fetching hourly forecast data. Please try again.");
    });
}

// Mevcut hava durumu verilerini ekranda gösteren fonksiyon
function displayWeather(data) {
  const tempDivInfo = document.getElementById("temp-div");
  const weatherInfoDiv = document.getElementById("weather-info");
  const weatherIcon = document.getElementById("weather-icon");
  const hourlyForecastDiv = document.getElementById("hourly-forecast");

  weatherInfoDiv.innerHTML = "";
  hourlyForecastDiv.innerHTML = "";
  tempDivInfo.innerHTML = "";

  if (data.cod === "404") {
    showError(data.message);
  }
  // API'den gelen verileri değişkenlere atar
  else {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

    const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

    tempDivInfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherHtml;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;

    showImage();
  }
}

// Saatlik hava tahmini verilerini gösteren fonksiyon
function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById("hourly-forecast");

  const next24Hours = hourlyData.slice(0, 8);
  next24Hours.forEach((item) => {
    const dateTime = new Date(item.dt * 1000); // Unix timestamp'ı normal tarihe çevir
    const hour = dateTime.getHours();
    const temperature = Math.round(item.main.temp - 273.15); // Kelvin'den Celsius'a çevirir
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

    hourlyForecastDiv.innerHTML += hourlyItemHtml;
  });
}

// Hava durumu ikonunu görünür yapan fonksiyon
function showImage() {
  const weatherIcon = document.getElementById("weather-icon");
  weatherIcon.style.display = "block";
}

// Hata mesajı fonksiyonu
function showError(message) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";

  setTimeout(() => {
    errorDiv.style.display = "none";
  }, 3000);
}

document.getElementById("city").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    getWeather();
    city.value = "";
  }
});
