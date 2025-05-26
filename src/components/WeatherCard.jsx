import React from 'react';
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
        <img src={iconUrl} alt={description} className="weather-icon" />
      </div>
      
      <div className="weather-main">
        <div className="temperature">
          <span className="temp-value">{Math.round(temp)}°C</span>
          <p className="weather-description">{description}</p>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">Cảm giác như:</span>
          <span className="detail-value">{Math.round(feels_like)}°C</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Độ ẩm:</span>
          <span className="detail-value">{humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Áp suất:</span>
          <span className="detail-value">{pressure} hPa</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Tốc độ gió:</span>
          <span className="detail-value">{speed} m/s</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;