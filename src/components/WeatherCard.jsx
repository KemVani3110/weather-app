/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect, useMemo } from "react";
import {
  Thermometer,
  Droplets,
  Gauge,
  Wind,
  Eye,
  Sunrise,
  Sunset,
  Share2,
  Check,
} from "lucide-react";
import { convertTemperature, convertWindSpeed } from "../utils/unitConverter";
import "../styles/WeatherCard.css";
import { getAQIByCoords } from "../services/weatherApi";

/**
 * Component hiển thị thông tin thời tiết hiện tại
 * @param {Object} weatherData - Dữ liệu thời tiết từ API
 * @param {string} temperatureUnit - Đơn vị nhiệt độ ('celsius' hoặc 'fahrenheit')
 */
const WeatherCard = ({ weatherData, temperatureUnit }) => {
  const [copied, setCopied] = useState(false); // Trạng thái đã sao chép
  const [aqi, setAqi] = useState(null); // AQI (chỉ số chất lượng không khí)

  // Nếu không có dữ liệu thời tiết thì không hiển thị gì cả
  if (!weatherData) return null;

  // Phân rã dữ liệu cho dễ sử dụng
  const {
    name,
    main: { temp, feels_like, humidity, pressure },
    weather: [{ description, icon }],
    wind: { speed },
    sys: { country, sunrise, sunset },
    visibility,
    coord, // Lấy toạ độ để fetch AQI
  } = weatherData;

  // Memo hóa các giá trị không cần tính lại mỗi lần render
  const iconUrl = useMemo(
    () => `https://openweathermap.org/img/wn/${icon}@2x.png`,
    [icon]
  );
  const displayTemp = useMemo(
    () => convertTemperature(temp, temperatureUnit),
    [temp, temperatureUnit]
  );
  const displayFeelsLike = useMemo(
    () => convertTemperature(feels_like, temperatureUnit),
    [feels_like, temperatureUnit]
  );
  const tempUnit = useMemo(
    () => (temperatureUnit === "celsius" ? "°C" : "°F"),
    [temperatureUnit]
  );

  // Định dạng thời gian mặc định
  const timeOptions = useMemo(
    () => ({ hour: "2-digit", minute: "2-digit" }),
    []
  );
  const sunriseTime = useMemo(
    () => new Date(sunrise * 1000).toLocaleTimeString("vi-VN", timeOptions),
    [sunrise, timeOptions]
  );
  const sunsetTime = useMemo(
    () => new Date(sunset * 1000).toLocaleTimeString("vi-VN", timeOptions),
    [sunset, timeOptions]
  );

  // Thời gian hiện tại, chỉ tính một lần khi render
  const currentDateTime = useMemo(() => {
    return new Date().toLocaleString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Lấy AQI từ toạ độ
  useEffect(() => {
    const fetchAQI = async () => {
      if (!coord) return;

      try {
        const aqiValue = await getAQIByCoords(coord.lat, coord.lon);
        setAqi(aqiValue);
      } catch (error) {
        console.error("Lỗi khi lấy chỉ số chất lượng không khí (AQI):", error);
      }
    };

    fetchAQI();
  }, [coord]);

  // Hàm hiển thị mức độ chất lượng không khí
  const getAqiLabel = (aqiValue) => {
    switch (aqiValue) {
      case 1:
        return "Tốt";
      case 2:
        return "Trung bình";
      case 3:
        return "Không tốt cho người nhạy cảm";
      case 4:
        return "Xấu";
      case 5:
        return "Rất xấu";
      default:
        return "Không rõ";
    }
  };

  /**
   * Xử lý chia sẻ thông tin thời tiết
   * Ưu tiên dùng Web Share API, nếu không thì fallback sang clipboard
   */
  const handleShare = async () => {
    const shareText = `🌤️ Thời tiết tại ${name}, ${country}:\n🌡️ Nhiệt độ: ${displayTemp}${tempUnit}\n💧 Độ ẩm: ${humidity}%\n💨 Gió: ${convertWindSpeed(
      speed
    )} km/h\n📍 ${description}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Thông tin thời tiết",
          text: shareText,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Lỗi khi chia sẻ qua Web Share API:", error);
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  /**
   * Sao chép văn bản vào clipboard
   */
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Không thể sao chép vào clipboard:", error);
    }
  };

  return (
    <div className="weather-card">
      {/* Header với tên thành phố và nút chia sẻ */}
      <div className="weather-header">
        <div>
          <h2 className="city-name">
            {name}, {country}
          </h2>
          <p className="current-time">{currentDateTime}</p>
        </div>

        <div className="weather-icon-container">
          <img
            src={iconUrl}
            alt={description}
            className="weather-icon"
            loading="lazy"
          />
          <button onClick={handleShare} className="share-btn" title="Chia sẻ">
            {copied ? <Check size={18} /> : <Share2 size={18} />}
          </button>
        </div>
      </div>

      {/* Nhiệt độ chính */}
      <div className="weather-main">
        <div className="temperature">
          <span className="temp-value">
            {displayTemp}
            {tempUnit}
          </span>
          <p className="weather-description">{description}</p>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="weather-details">
        {/* Cảm giác như */}
        <div className="detail-item">
          <div className="detail-label">
            <Thermometer size={18} className="detail-icon" />
            <span>Cảm giác như:</span>
          </div>
          <span className="detail-value">
            {displayFeelsLike}
            {tempUnit}
          </span>
        </div>

        {/* Độ ẩm */}
        <div className="detail-item">
          <div className="detail-label">
            <Droplets size={18} className="detail-icon" />
            <span>Độ ẩm:</span>
          </div>
          <span className="detail-value">{humidity}%</span>
        </div>

        {/* Áp suất */}
        <div className="detail-item">
          <div className="detail-label">
            <Gauge size={18} className="detail-icon" />
            <span>Áp suất:</span>
          </div>
          <span className="detail-value">{pressure} mb</span>
        </div>

        {/* Tốc độ gió */}
        <div className="detail-item">
          <div className="detail-label">
            <Wind size={18} className="detail-icon" />
            <span>Tốc độ gió:</span>
          </div>
          <span className="detail-value">{convertWindSpeed(speed)} km/h</span>
        </div>

        {/* Tầm nhìn (nếu có dữ liệu) */}
        {visibility !== undefined && (
          <div className="detail-item">
            <div className="detail-label">
              <Eye size={18} className="detail-icon" />
              <span>Tầm nhìn:</span>
            </div>
            <span className="detail-value">
              {(visibility / 1000).toFixed(1)} km
            </span>
          </div>
        )}

        {/* Mặt trời mọc */}
        <div className="detail-item">
          <div className="detail-label">
            <Sunrise size={18} className="detail-icon" />
            <span>Mặt trời mọc:</span>
          </div>
          <span className="detail-value">{sunriseTime}</span>
        </div>

        {/* Mặt trời lặn */}
        <div className="detail-item">
          <div className="detail-label">
            <Sunset size={18} className="detail-icon" />
            <span>Mặt trời lặn:</span>
          </div>
          <span className="detail-value">{sunsetTime}</span>
        </div>

        {/* Chất lượng không khí */}
        {aqi && (
          <div className="detail-item">
            <div className="detail-label">
              <Gauge size={18} className="detail-icon" />
              <span>Chất lượng không khí:</span>
            </div>
            <span className="detail-value">{getAqiLabel(aqi)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;
