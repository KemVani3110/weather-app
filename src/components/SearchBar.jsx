/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, Clock } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch, isLoading, searchHistory }) => {
  const [city, setCity] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const debouncedCity = useDebounce(city, 300);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setShowHistory(false);
    }
  };

  const handleHistorySelect = (historyCity) => {
    setCity(historyCity);
    onSearch(historyCity);
    setShowHistory(false);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onSearch(null, position.coords.latitude, position.coords.longitude);
          setLocationLoading(false);
        },
        (error) => {
          let errorMessage = 'Không thể lấy vị trí hiện tại';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Bạn đã từ chối chia sẻ vị trí';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Không thể xác định vị trí';
              break;
            case error.TIMEOUT:
              errorMessage = 'Hết thời gian chờ lấy vị trí';
              break;
          }
          alert(errorMessage);
          setLocationLoading(false);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      alert('Trình duyệt không hỗ trợ định vị');
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <Search size={20} className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            placeholder="Nhập tên thành phố..."
            className="search-input"
            disabled={isLoading}
          />
          
          {showHistory && searchHistory.length > 0 && (
            <div className="search-history">
              <div className="history-header">
                <Clock size={16} />
                <span>Tìm kiếm gần đây</span>
              </div>
              {searchHistory.map((historyCity, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleHistorySelect(historyCity)}
                  className="history-item"
                >
                  {historyCity}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button type="submit" disabled={isLoading || !city.trim()} className="search-button">
          {isLoading ? <Loader2 size={20} className="loading-icon" /> : <Search size={20} />}
          Tìm kiếm
        </button>
      </form>
      
      <button 
        onClick={handleGetLocation} 
        disabled={isLoading || locationLoading} 
        className="location-button"
      >
        {locationLoading ? (
          <Loader2 size={20} className="loading-icon" />
        ) : (
          <MapPin size={20} />
        )}
        Vị trí hiện tại
      </button>
    </div>
  );
};

export default SearchBar;