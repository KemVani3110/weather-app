import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import LoadingSpinner from "./components/LoadingSpinner";
import { useCurrentWeather, useWeatherByCoords } from "./hooks/useWeather";
import "./styles/App.css";

function App() {
  const [searchCity, setSearchCity] = useState("");
  const [coords, setCoords] = useState({ lat: null, lon: null });

  const {
    data: weatherData,
    isLoading: isLoadingCity,
    error: cityError,
  } = useCurrentWeather(searchCity);

  const {
    data: coordsWeatherData,
    isLoading: isLoadingCoords,
    error: coordsError,
  } = useWeatherByCoords(coords.lat, coords.lon);

  const isLoading = isLoadingCity || isLoadingCoords;
  const error = cityError || coordsError;
  const currentWeatherData = weatherData || coordsWeatherData;

  const handleSearch = (city, lat, lon) => {
    if (city) {
      setSearchCity(city);
      setCoords({ lat: null, lon: null });
    } else if (lat && lon) {
      setCoords({ lat, lon });
      setSearchCity("");
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🌤️ Ứng Dụng Thời Tiết</h1>
        <p>Tra cứu thời tiết nhanh chóng và chính xác</p>
      </header>

      <main className="app-main">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {isLoading && <LoadingSpinner />}

        {error && (
          <div className="error-message">
            <p>❌ {error.message}</p>
          </div>
        )}

        {currentWeatherData && !isLoading && (
          <WeatherCard weatherData={currentWeatherData} />
        )}

        {!currentWeatherData && !isLoading && !error && (
          <div className="welcome-message">
            <p>
              🔍 Nhập tên thành phố hoặc sử dụng vị trí hiện tại để xem thời
              tiết
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
