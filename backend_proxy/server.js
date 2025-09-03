// Environment variables'ları yükler
require("dotenv").config();

const express = require("express"); // Web server framework
const axios = require("axios"); // HTTP istekleri için
const cors = require("cors"); // CORS middleware için
const path = require("path");

const app = express();
const PORT = 5000;

// CORS middleware'ini etkinleştirir
app.use(cors());

// CORS middleware'ini etkinleştirir
app.use(cors());

// frontend dosyalarını (index.html, script.js, style.css) servis et
app.use(express.static(path.join(__dirname, "../")));

// Hava durumu endpoint'i
app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City required" });

  try {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.API_KEY}&units=metric`;

    // Her iki API çağrısını paralel olarak yapar
    const [current, forecast] = await Promise.all([
      axios.get(currentUrl),
      axios.get(forecastUrl),
    ]);
    //hem current hem forecast verisini birleştirir
    res.json({ current: current.data, forecast: forecast.data });
  } catch (err) {
    res.status(500).json({ error: "API request failed" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Backend running at http://localhost:${PORT}`)
);
