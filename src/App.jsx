import React, { useState, useEffect } from "react";
import { Cloud, AlertCircle, Search, RefreshCw } from "lucide-react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import LoadingSpinner from "./components/LoadingSpinner";
import { useCurrentWeather, useWeatherByCoords } from "./hooks/useWeather";
import { getSearchHistory, addToSearchHistory } from "./utils/localStorage";
import "./styles/App.css";

function App() {
  const [searchCity, setSearchCity] = useState("");
  const [coords, setCoords] = useState({ lat: null, lon: null });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [temperatureUnit, setTemperatureUnit] = useState(() => {
    return localStorage.getItem('temperatureUnit') || 'celsius';
  });

  const {
    data: weatherData,
    isLoading: isLoadingCity,
    error: cityError,
    refetch: refetchCity,
  } = useCurrentWeather(searchCity);

  const {
    data: coordsWeatherData,
    isLoading: isLoadingCoords,
    error: coordsError,
    refetch: refetchCoords,
  } = useWeatherByCoords(coords.lat, coords.lon);

  const isLoading = isLoadingCity || isLoadingCoords;
  const error = cityError || coordsError;
  const currentWeatherData = weatherData || coordsWeatherData;

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('temperatureUnit', temperatureUnit);
  }, [temperatureUnit]);

  const handleSearch = (city, lat, lon) => {
    if (city) {
      setSearchCity(city);
      setCoords({ lat: null, lon: null });
      addToSearchHistory(city);
    } else if (lat && lon) {
      setCoords({ lat, lon });
      setSearchCity("");
    }
  };

  const handleRetry = () => {
    if (searchCity) {
      refetchCity();
    } else if (coords.lat && coords.lon) {
      refetchCoords();
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleTemperatureUnit = () => {
    setTemperatureUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <Cloud size={48} className="header-icon" />
          <h1>Ứng Dụng Thời Tiết</h1>
          <p>Tra cứu thời tiết nhanh chóng và chính xác</p>
          
          <div className="header-controls">
            <button onClick={toggleDarkMode} className="control-btn">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={toggleTemperatureUnit} className="control-btn">
              °{temperatureUnit === 'celsius' ? 'F' : 'C'}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <SearchBar 
          onSearch={handleSearch} 
          isLoading={isLoading}
          searchHistory={getSearchHistory()}
        />

        {isLoading && <LoadingSpinner />}

        {error && (
          <div className="error-message">
            <AlertCircle size={20} className="error-icon" />
            <div className="error-content">
              <p>{error.message}</p>
              <button onClick={handleRetry} className="retry-btn">
                <RefreshCw size={16} />
                Thử lại
              </button>
            </div>
          </div>
        )}

        {currentWeatherData && !isLoading && (
          <WeatherCard 
            weatherData={currentWeatherData} 
            temperatureUnit={temperatureUnit}
          />
        )}

        {!currentWeatherData && !isLoading && !error && (
          <div className="welcome-message">
            <Search size={48} className="welcome-icon" />
            <p>
              Nhập tên thành phố hoặc sử dụng vị trí hiện tại để xem thời tiết
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;