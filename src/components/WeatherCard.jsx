import React, { useState, useRef } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Gauge, 
  Wind, 
  Eye, 
  Sunrise, 
  Sunset,
  Share2,
  Check
} from 'lucide-react';
import { convertTemperature, convertWindSpeed } from '../utils/unitConverter';
import '../styles/WeatherCard.css';

const WeatherCard = ({ weatherData, temperatureUnit }) => {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef();

  if (!weatherData) return null;

  const {
    name,
    main: { temp, feels_like, humidity, pressure },
    weather: [{ description, icon }],
    wind: { speed },
    sys: { country, sunrise, sunset },
    visibility
  } = weatherData;

  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  
  const displayTemp = convertTemperature(temp, temperatureUnit);
  const displayFeelsLike = convertTemperature(feels_like, temperatureUnit);
  const tempUnit = temperatureUnit === 'celsius' ? '°C' : '°F';
  
  const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const sunsetTime = new Date(sunset * 1000).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleShare = async () => {
    const shareText = `🌤️ Thời tiết tại ${name}, ${country}:
🌡️ Nhiệt độ: ${displayTemp}${tempUnit}
💧 Độ ẩm: ${humidity}%
💨 Gió: ${convertWindSpeed(speed)} km/h
📍 ${description}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Thông tin thời tiết',
          text: shareText,
        });
      } catch (error) {
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Không thể sao chép:', error);
    }
  };

  return (
    <div className="weather-card" ref={cardRef}>
      <div className="weather-header">
        <div>
          <h2 className="city-name">{name}, {country}</h2>
          <p className="current-time">
            {new Date().toLocaleString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
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
      
      <div className="weather-main">
        <div className="temperature">
          <span className="temp-value">{displayTemp}{tempUnit}</span>
          <p className="weather-description">{description}</p>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <div className="detail-label">
            <Thermometer size={18} className="detail-icon" />
            <span>Cảm giác như:</span>
          </div>
          <span className="detail-value">{displayFeelsLike}{tempUnit}</span>
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
          <span className="detail-value">{convertWindSpeed(speed)} km/h</span>
        </div>
        
        {visibility && (
          <div className="detail-item">
            <div className="detail-label">
              <Eye size={18} className="detail-icon" />
              <span>Tầm nhìn:</span>
            </div>
            <span className="detail-value">{(visibility / 1000).toFixed(1)} km</span>
          </div>
        )}
        
        <div className="detail-item">
          <div className="detail-label">
            <Sunrise size={18} className="detail-icon" />
            <span>Mặt trời mọc:</span>
          </div>
          <span className="detail-value">{sunriseTime}</span>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">
            <Sunset size={18} className="detail-icon" />
            <span>Mặt trời lặn:</span>
          </div>
          <span className="detail-value">{sunsetTime}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;