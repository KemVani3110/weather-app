/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
import { useState, useRef, useCallback } from "react";
import { Search, MapPin, Loader2, Clock } from "lucide-react";
import "../styles/SearchBar.css";

/**
 * Component thanh tìm kiếm thời tiết
 * @param {Function} onSearch - Callback khi tìm kiếm (city, lat, lon)
 * @param {boolean} isLoading - Trạng thái đang tải
 * @param {Array} searchHistory - Lịch sử tìm kiếm
 */
const SearchBar = ({ onSearch, isLoading, searchHistory }) => {
  // State quản lý input tìm kiếm
  const [city, setCity] = useState("");

  // State hiển thị/ẩn dropdown lịch sử tìm kiếm
  const [showHistory, setShowHistory] = useState(false);

  // State loading khi đang lấy vị trí GPS
  const [locationLoading, setLocationLoading] = useState(false);

  // Theo dõi user đã tương tác với input chưa
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Ref để focus vào input
  const inputRef = useRef();

  /**
   * Xử lý submit form tìm kiếm
   */
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (city.trim()) {
        onSearch(city.trim());
        setShowHistory(false);
      }
    },
    [city, onSearch]
  );
  /**
   * Xử lý chọn item từ lịch sử tìm kiếm
   */
  const handleHistorySelect = useCallback(
    (historyCity) => {
      setCity(historyCity);
      onSearch(historyCity);
      setShowHistory(false);
    },
    [onSearch]
  );

  /**
   * Xử lý khi focus vào input
   */
  const handleInputFocus = useCallback(() => {
    setHasUserInteracted(true);
    if (city.trim().length > 0 || searchHistory.length > 0) {
      setShowHistory(true);
    }
  }, [city, searchHistory]);
  /**
   * Xử lý khi thay đổi nội dung input
   */
  const handleInputChange = useCallback(
    (e) => {
      setCity(e.target.value);
      setHasUserInteracted(true);
      if (e.target.value.trim().length > 0 && searchHistory.length > 0) {
        setShowHistory(true);
      } else {
        setShowHistory(false);
      }
    },
    [searchHistory]
  );
  /**
   * Xử lý lấy vị trí hiện tại của user
   * Sử dụng Geolocation API của browser
   */
  const handleGetLocation = useCallback(() => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onSearch(null, position.coords.latitude, position.coords.longitude);
          setLocationLoading(false);
        },
        (error) => {
          let errorMessage = "Không thể lấy vị trí hiện tại";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Bạn đã từ chối chia sẻ vị trí";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Không thể xác định vị trí";
              break;
            case error.TIMEOUT:
              errorMessage = "Hết thời gian chờ lấy vị trí";
              break;
          }
          alert(errorMessage);
          setLocationLoading(false);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      alert("Trình duyệt không hỗ trợ định vị");
    }
  }, [onSearch]);

  return (
    <div className="search-bar">
      {/* Form tìm kiếm */}
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          {/* Icon tìm kiếm */}
          <Search size={20} className="search-icon" />

          {/* Input tìm kiếm */}
          <input
            ref={inputRef}
            type="text"
            value={city}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)} // Delay để có thể click vào history
            placeholder="Nhập tên thành phố..."
            aria-label="Nhập tên thành phố để tìm kiếm thời tiết"
            className="search-input"
            disabled={isLoading}
          />

          {/* Dropdown lịch sử tìm kiếm */}
          {showHistory && searchHistory.length > 0 && (
            <div className="search-history">
              <div className="history-header">
                <Clock size={16} />
                <span>Tìm kiếm gần đây</span>
              </div>

              {/*Danh sách lịch sử*/}
              {searchHistory.map((historyCity, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleHistorySelect(historyCity)}
                  className="history-item"
                  aria-label={`Tìm kiếm thời tiết cho ${historyCity}`}
                >
                  {historyCity}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nút submit tìm kiếm */}
        <button
          type="submit"
          disabled={isLoading || !city.trim()}
          className="search-button"
        >
          {/* Hiển thị loading icon khi đang tải */}
          {isLoading ? (
            <Loader2 size={20} className="loading-icon" />
          ) : (
            <Search size={20} />
          )}
          Tìm kiếm
        </button>
      </form>

      {/* Nút lấy vị trí hiện tại */}
      <button
        onClick={handleGetLocation}
        disabled={isLoading || locationLoading}
        className="location-button"
      >
        {/* Hiển thị loading icon khi đang lấy vị trí */}
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
