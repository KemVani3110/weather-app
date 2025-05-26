import React from 'react';
import { Loader2 } from 'lucide-react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <Loader2 size={48} className="spinner-icon" />
      <p>Đang tải dữ liệu thời tiết...</p>
    </div>
  );
};

export default LoadingSpinner;