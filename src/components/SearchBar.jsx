import React, { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch, isLoading }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onSearch(null, position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          alert('Không thể lấy vị trí hiện tại');
        }
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
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Nhập tên thành phố..."
            className="search-input"
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading || !city.trim()} className="search-button">
          {isLoading ? <Loader2 size={20} className="loading-icon" /> : <Search size={20} />}
          Tìm kiếm
        </button>
      </form>
      <button onClick={handleGetLocation} disabled={isLoading} className="location-button">
        <MapPin size={20} />
        Vị trí hiện tại
      </button>
    </div>
  );
};

export default SearchBar;