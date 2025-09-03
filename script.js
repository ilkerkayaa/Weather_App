function getWeather() {
  const city = document.getElementById("city").value;
  if (!city) {
    showError("Please enter a city");
    return;
  }

  const url = `http://localhost:5000/weather?city=${city}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Backend'den gelen JSON'u kullanır
      displayWeather(data.current); // anlık hava durumu
      displayHourlyForecast(data.forecast.list); // saatlik tahmin
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      showError("Weather data could not be fetched. Please try again.");
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
    const temperature = Math.round(data.main.temp);
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
    const temperature = Math.round(item.main.temp);
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
