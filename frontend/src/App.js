import React, { useState, useEffect } from "react";
import LocationInput from "./components/LocationInput";
import RecommendationList from "./components/RecommendationList";
import { fetchRecommendations } from "./services/api";

// Handle price strings like "$12.99" safely when sorting
function getNumericPrice(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

// Build a friendly weather/time context sentence for the header
// Uses API's metric units (°C) directly and remote timezone from OpenWeather.
function buildWeatherContext(weather) {
  if (!weather || !weather.weather || weather.weather.length === 0) {
    return "";
  }

  const main = (weather.weather[0].main || "").toLowerCase(); // "clear", "rain", "clouds", ...
  const tempC =
    weather.main && typeof weather.main.temp === "number"
      ? Math.round(weather.main.temp) // already metric from backend
      : null;

  // Compute local time at the selected location using timezone offset (seconds from UTC)
  const now = new Date();
  const utcMillis = now.getTime() + now.getTimezoneOffset() * 60_000;

  let localHour;
  if (typeof weather.timezone === "number") {
    const localMillis = utcMillis + weather.timezone * 1000;
    localHour = new Date(localMillis).getHours();
  } else {
    localHour = now.getHours();
  }

  const isNight = localHour >= 20 || localHour < 6;
  const isMorning = localHour >= 6 && localHour < 12;
  const isAfternoon = localHour >= 12 && localHour < 17;
  const isEvening = localHour >= 17 && localHour < 20;

  let timePhrase = "day";
  if (isNight) timePhrase = "night";
  else if (isMorning) timePhrase = "morning";
  else if (isAfternoon) timePhrase = "afternoon";
  else if (isEvening) timePhrase = "evening";

  let mood = "";
  let suggestion = "";

  switch (main) {
    case "clear":
      mood = `a clear, ${timePhrase === "night" ? "pleasant" : "sunny"} ${timePhrase}`;
      if (tempC !== null && tempC >= 28) {
        suggestion =
          "Perfect time to enjoy cold drinks, ice‑creams, and light refreshing dishes.";
      } else if (tempC !== null && tempC <= 15) {
        suggestion =
          "A bit cool, so mildly warm meals, soups, and baked dishes will feel great.";
      } else {
        suggestion =
          "Great for grills, balanced meals, and not‑too‑heavy dishes.";
      }
      break;

    case "clouds":
      mood = `a cozy, cloudy ${timePhrase}`;
      suggestion =
        "Mildly warm bowls, sandwiches, and snacks work really well right now.";
      break;

    case "rain":
    case "drizzle":
      mood = `a rainy ${timePhrase}`;
      suggestion =
        "Comfort foods, hot soups, pakoras, and tea/coffee are a perfect match.";
      break;

    case "thunderstorm":
      mood = `a stormy ${timePhrase}`;
      suggestion =
        "Stay in with hot, comforting meals and warm drinks.";
      break;

    case "snow":
      mood = `a cold, snowy ${timePhrase}`;
      suggestion =
        "Rich curries, baked dishes, and hearty soups are ideal.";
      break;

    default:
      mood = `a nice ${timePhrase}`;
      suggestion =
        "Here are some options you might enjoy right now.";
      break;
  }

  const tempText = tempC != null ? `around ${tempC}°C, ` : "";

  // Use "\n" so we can split into two lines in JSX
  return `Right now it is ${tempText}${mood}.\n${suggestion}`;
}

function App() {
  // theme (light / dark), persisted
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  const [showMainUI, setShowMainUI] = useState(false);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    name: "",
  });
  const [recommendations, setRecommendations] = useState([]);
  const [weatherDesc, setWeatherDesc] = useState(""); // kept for compatibility
  const [weatherContext, setWeatherContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("name"); // name | price | rating

  // apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // fetch recommendations when location changes (same logic, with richer weather text)
  useEffect(() => {
    if (location.latitude !== null && location.longitude !== null) {
      setLoading(true);
      setError("");
      fetchRecommendations(location.latitude, location.longitude, location.name)
        .then((data) => {
          setRecommendations(data.recommendations || []);
          const weather = data.weather;
          if (weather && weather.weather && weather.weather.length > 0) {
            const desc = weather.weather[0].main.toLowerCase();
            setWeatherDesc(desc);
            setWeatherContext(buildWeatherContext(weather));
          } else {
            setWeatherDesc("");
            setWeatherContext("");
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load recommendations");
          setLoading(false);
        });
    }
  }, [location]);

  // sort but handle "$" in price strings
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    if (filter === "price") {
      return getNumericPrice(a.price) - getNumericPrice(b.price);
    }
    if (filter === "rating") {
      const ar = typeof a.rate === "number" ? a.rate : 0;
      const br = typeof b.rate === "number" ? b.rate : 0;
      return br - ar;
    }
    if (filter === "name") {
      const an = a.name || "";
      const bn = b.name || "";
      return an.localeCompare(bn);
    }
    return 0;
  });

  const handleStartClick = () => setShowMainUI(true);

  return !showMainUI ? (
    // HOME SCREEN
    <div className="initial-screen">
      <div className="initial-overlay">
        <div className="initial-card">
          <h1>🍽️ Smart Food Recommender</h1>
          <p>
            Get context‑aware meal ideas based on your location, weather, and
            time of day.
          </p>
          <div className="initial-actions">
            <button className="start-button" onClick={handleStartClick}>
              Start Exploring 🍲
            </button>
            <button
              className="theme-toggle-btn secondary-toggle"
              onClick={toggleTheme}
            >
              {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    // MAIN SCREEN
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>🍴 Food Recommendation App</h1>
          {weatherContext &&
            weatherContext.split("\n").map((line, idx) => (
              <p key={idx} className="weather-text">
                {line}
              </p>
            ))}
        </div>
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
        </button>
      </header>

      <main className="app-main">
        <section className="top-bar">
          {/* LEFT: location + loading / error text below it */}
          <div className="top-left">
            <LocationInput location={location} setLocation={setLocation} />
            {loading && (
              <p className="loading-text">⏳ Loading recommendations...</p>
            )}
            {error && <p className="error-text">{error}</p>}
          </div>

          {/* RIGHT: sort-by, aligned horizontally with location */}
          <div className="filter-group horizontal">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="name">Name 🔤</option>
              <option value="price">Price 💲</option>
              <option value="rating">Rating ⭐</option>
            </select>
          </div>
        </section>

        <section className="list-section">
          <RecommendationList recommendations={sortedRecommendations} />
        </section>
      </main>
    </div>
  );
}

export default App;
