import React from 'react';
import { Thermometer, Droplets, Gauge, Wind} from 'lucide-react';
import '../styles/WeatherCard.css';

const WeatherCard = ({ weatherData }) => {
  if (!weatherData) return null;

  const {
    name,
    main: { temp, feels_like, humidity, pressure },
    weather: [{ description, icon }],
    wind: { speed },
    sys: { country }
  } = weatherData;

  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2 className="city-name">{name}, {country}</h2>
        <div className="weather-icon-container">
          <img src={iconUrl} alt={description} className="weather-icon" />
        </div>
      </div>
      
      <div className="weather-main">
        <div className="temperature">
          <span className="temp-value">{Math.round(temp)}°C</span>
          <p className="weather-description">{description}</p>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <div className="detail-label">
            <Thermometer size={18} className="detail-icon" />
            <span>Cảm giác như:</span>
          </div>
          <span className="detail-value">{Math.round(feels_like)}°C</span>
        </div>
        <div className="detail-item">
          <div className="detail-label">
            <Droplets size={18} className="detail-icon" />
            <span>Độ ẩm:</span>
          </div>
          <span className="detail-value">{humidity}%</span>
        </div>
        <div className="detail-item">
          <div className="detail-label">
            <Gauge size={18} className="detail-icon" />
            <span>Áp suất:</span>
          </div>
          <span className="detail-value">{pressure} hPa</span>
        </div>
        <div className="detail-item">
          <div className="detail-label">
            <Wind size={18} className="detail-icon" />
            <span>Tốc độ gió:</span>
          </div>
          <span className="detail-value">{speed} m/s</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;