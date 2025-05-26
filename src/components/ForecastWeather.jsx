import { Calendar } from "lucide-react";
import { convertTemperature } from "../utils/unitConverter";
import "../styles/ForecastWeather.css";

/**
 * Component hiển thị dự báo thời tiết nhiều ngày
 * @param {Object} forecastData - Dữ liệu dự báo từ API OpenWeatherMap
 * @param {string} temperatureUnit - Đơn vị nhiệt độ ('celsius' hoặc 'fahrenheit')
 */
const ForecastWeather = ({ forecastData, temperatureUnit }) => {
  // Kiểm tra dữ liệu có hợp lệ không
  if (!forecastData || !forecastData.list || forecastData.list.length === 0) {
    return null; // Không render gì nếu không có dữ liệu
  }

  // OpenWeatherMap API trả về dữ liệu mỗi 3 tiếng (8 mục/ngày)
  // Lọc để lấy 1 dự báo mỗi ngày, bắt đầu từ ngày mai
  // index % 8 === 0: lấy mục đầu tiên của mỗi ngày
  // slice(1, 6): bỏ ngày hôm nay, lấy 5 ngày tiếp theo
  const dailyForecasts = forecastData.list
    .filter((_, index) => index % 8 === 0)
    .slice(1, 6);

  // Xử lý trường hợp không có đủ dữ liệu theo ngày
  if (dailyForecasts.length === 0) {
    // Fallback: lấy 5 mục đầu tiên nếu không có đủ dữ liệu theo ngày
    const fallbackForecasts = forecastData.list.slice(0, 5);
    if (fallbackForecasts.length === 0) return null;

    return renderForecast(fallbackForecasts, temperatureUnit);
  }

  // Render dữ liệu dự báo đã lọc
  return renderForecast(dailyForecasts, temperatureUnit);
};

/**
 * Hàm render giao diện dự báo thời tiết
 * @param {Array} forecasts - Mảng dữ liệu dự báo đã được lọc
 * @param {string} temperatureUnit - Đơn vị nhiệt độ
 */
const renderForecast = (forecasts, temperatureUnit) => {
  /**
   * Chuyển đổi timestamp thành tên ngày bằng tiếng Việt
   * @param {number} timestamp - Unix timestamp
   * @returns {string} Tên ngày đã format
   */
  const getDayName = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("vi-VN", {
      weekday: "short", // Thứ 2, Thứ 3...
      month: "short", // Tháng 1, Tháng 2...
      day: "numeric", // 1, 2, 3...
    });
  };

  return (
    <div className="forecast-weather">
      {/* Header với icon lịch và tiêu đề */}
      <div className="forecast-header">
        <Calendar size={24} />
        <h3>Dự báo {forecasts.length} ngày tới</h3>
      </div>

      {/* Danh sách các ngày dự báo */}
      <div className="forecast-list">
        {forecasts.map((forecast, index) => (
          <div key={index} className="forecast-item">
            {/* Hiển thị tên ngày */}
            <div className="forecast-day">{getDayName(forecast.dt)}</div>

            {/* Icon thời tiết từ OpenWeatherMap */}
            <div className="forecast-icon">
              <img
                src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                alt={forecast.weather[0].description}
                width="40"
                height="40"
                loading="lazy" // Lazy loading để tối ưu hiệu suất
              />
            </div>

            {/* Nhiệt độ cao nhất và thấp nhất */}
            <div className="forecast-temps">
              <span className="temp-high">
                {convertTemperature(forecast.main.temp_max, temperatureUnit)}°
              </span>
              <span className="temp-low">
                {convertTemperature(forecast.main.temp_min, temperatureUnit)}°
              </span>
            </div>

            {/* Mô tả thời tiết */}
            <div className="forecast-desc">
              {forecast.weather[0].description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastWeather;
