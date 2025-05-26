import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Đang tải dữ liệu thời tiết...</p>
    </div>
  );
};

export default LoadingSpinner;