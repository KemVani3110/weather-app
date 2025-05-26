import { useState, useEffect } from "react";
import { Cloud, AlertCircle, Search, RefreshCw } from "lucide-react";
import ForecastWeather from "./components/ForecastWeather";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import LoadingSpinner from "./components/LoadingSpinner";
import {
  useCurrentWeather,
  useWeatherByCoords,
  useForecast,
  useForecastByCoords,
  useAQIByCoords,
} from "./hooks/useWeather";
import { getSearchHistory, addToSearchHistory } from "./utils/localStorage";
import "./styles/App.css";

/**
 * Component chính của ứng dụng thời tiết
 * Quản lý state tổng thể và điều phối các component con
 *
 * Features:
 * - Tìm kiếm thời tiết theo tên thành phố hoặc tọa độ GPS
 * - Dark mode toggle
 * - Chuyển đổi đơn vị nhiệt độ (°C/°F)
 * - Lưu lịch sử tìm kiếm
 * - Hiển thị thời tiết hiện tại và dự báo 5 ngày
 */
function App() {
  // State cho tìm kiếm theo tên thành phố
  const [searchCity, setSearchCity] = useState("");

  // State cho tìm kiếm theo tọa độ GPS
  const [coords, setCoords] = useState({ lat: null, lon: null });

  // State cho dark mode, lấy từ localStorage hoặc mặc định false
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  // State cho đơn vị nhiệt độ, lấy từ localStorage hoặc mặc định "celsius"
  const [temperatureUnit, setTemperatureUnit] = useState(
    () => localStorage.getItem("temperatureUnit") || "celsius"
  );

  // === REACT QUERY HOOKS ===

  // Hook lấy thời tiết hiện tại theo tên thành phố
  const {
    data: weatherData, // Dữ liệu thời tiết
    isLoading: isLoadingCity, // Loading state
    error: cityError, // Error state
    refetch: refetchCity, // Function để retry
  } = useCurrentWeather(searchCity);

  // Hook lấy thời tiết hiện tại theo tọa độ
  const {
    data: coordsWeatherData,
    isLoading: isLoadingCoords,
    error: coordsError,
    refetch: refetchCoords,
  } = useWeatherByCoords(coords.lat, coords.lon);

  // Hook lấy chỉ số chất lượng không khí (AQI) theo tọa độ
  const {
    data: aqiData,
    isLoading: isAQILoading,
    error: aqiError,
  } = useAQIByCoords(
    coords.lat || weatherData?.coord?.lat,
    coords.lon || weatherData?.coord?.lon
  );

  // Hook lấy dự báo thời tiết theo tên thành phố
  const { data: forecastData, isLoading: isLoadingForecast } =
    useForecast(searchCity);

  // Hook lấy dự báo thời tiết theo tọa độ
  const { data: coordsForecastData, isLoading: isLoadingCoordsForecast } =
    useForecastByCoords(coords.lat, coords.lon);

  // === COMPUTED VALUES ===

  // Tổng hợp loading state từ cả ba phương thức tìm kiếm
  const isLoading = isLoadingCity || isLoadingCoords || isAQILoading;

  // Tổng hợp error state từ cả ba phương thức
  const error = cityError || coordsError || aqiError;

  // Chọn data thời tiết hiện tại (ưu tiên city search trước coords)
  const currentWeatherData = weatherData || coordsWeatherData;

  // Chọn data dự báo thời tiết (ưu tiên city search trước coords)
  const currentForecastData = forecastData || coordsForecastData;

  // Tổng hợp loading state cho forecast
  const isForecastLoading = isLoadingForecast || isLoadingCoordsForecast;

  // === SIDE EFFECTS ===

  /**
   * Effect để apply dark mode class vào body và lưu vào localStorage
   * Chạy mỗi khi darkMode state thay đổi
   */
  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  /**
   * Effect để lưu temperatureUnit vào localStorage
   * Chạy mỗi khi temperatureUnit thay đổi
   */
  useEffect(() => {
    localStorage.setItem("temperatureUnit", temperatureUnit);
  }, [temperatureUnit]);

  // === EVENT HANDLERS ===

  /**
   * Handler cho việc search thời tiết
   * Có thể search theo tên thành phố hoặc tọa độ GPS
   *
   * @param {string} city - Tên thành phố (optional)
   * @param {number} lat - Vĩ độ (optional)
   * @param {number} lon - Kinh độ (optional)
   */
  const handleSearch = (city, lat, lon) => {
    if (city) {
      // Search theo tên thành phố
      setSearchCity(city);
      setCoords({ lat: null, lon: null }); // Reset coords
      addToSearchHistory(city); // Lưu vào history
    } else if (lat && lon) {
      // Search theo tọa độ GPS
      setCoords({ lat, lon });
      setSearchCity(""); // Reset city search
    }
  };

  /**
   * Handler để retry API call khi có lỗi
   * Gọi refetch tương ứng với phương thức search hiện tại
   */
  const handleRetry = () => {
    if (searchCity) {
      refetchCity(); // Retry city search
    } else if (coords.lat && coords.lon) {
      refetchCoords(); // Retry coords search
    }
  };

  /**
   * Toggle dark mode on/off
   */
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  /**
   * Toggle đơn vị nhiệt độ giữa Celsius và Fahrenheit
   */
  const toggleTemperatureUnit = () => {
    setTemperatureUnit((prev) =>
      prev === "celsius" ? "fahrenheit" : "celsius"
    );
  };

  // === RENDER ===

  return (
    <div className="App">
      {/* Header với title và các controls */}
      <header className="app-header">
        <div className="header-content">
          <Cloud size={48} className="header-icon" />
          <h1>Ứng Dụng Thời Tiết</h1>
          <p>Tra cứu thời tiết nhanh chóng và chính xác</p>

          {/* Controls cho dark mode và temperature unit */}
          <div className="header-controls">
            <button onClick={toggleDarkMode} className="control-btn">
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button onClick={toggleTemperatureUnit} className="control-btn">
              °{temperatureUnit === "celsius" ? "F" : "C"}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Search bar với history support */}
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          searchHistory={getSearchHistory()}
        />

        {/* Loading spinner khi đang fetch data */}
        {isLoading && <LoadingSpinner />}

        {/* Error message với retry button */}
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

        {/* Main content: Weather card và forecast */}
        {currentWeatherData && !isLoading && (
          <>
            {/* Card hiển thị thời tiết hiện tại */}
            <WeatherCard
              weatherData={currentWeatherData}
              temperatureUnit={temperatureUnit}
              aqi={aqiData}
            />

            {/* Forecast component - chỉ hiển thị khi có data và không loading */}
            {currentForecastData && !isForecastLoading && (
              <ForecastWeather
                forecastData={currentForecastData}
                temperatureUnit={temperatureUnit}
              />
            )}
          </>
        )}

        {/* Welcome message khi chưa có data */}
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
