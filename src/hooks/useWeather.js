import { useQuery } from "@tanstack/react-query";
import {
  getCurrentWeather,
  getWeatherByCoords,
  getForecast,
  getForecastByCoords,
  getAQIByCoords,
} from "../services/weatherApi";

/**
 * Custom hook để lấy thời tiết hiện tại theo tên thành phố
 * Sử dụng React Query để cache và quản lý state
 *
 * @param {string} city - Tên thành phố
 * @returns {Object} - Object chứa data, loading, error từ React Query
 */
export const useCurrentWeather = (city) => {
  return useQuery({
    queryKey: ["weather", city], // Key để cache, thay đổi khi city thay đổi
    queryFn: () => getCurrentWeather(city), // Function gọi API
    enabled: !!city, // Chỉ gọi API khi có city
    retry: 2, // Retry 2 lần nếu fail
  });
};

/**
 * Custom hook để lấy thời tiết hiện tại theo tọa độ GPS
 *
 * @param {number} lat - Vĩ độ
 * @param {number} lon - Kinh độ
 * @returns {Object} - Object chứa data, loading, error từ React Query
 */
export const useWeatherByCoords = (lat, lon) => {
  return useQuery({
    queryKey: ["weather", lat, lon], // Key cache theo tọa độ
    queryFn: () => getWeatherByCoords(lat, lon), // Function gọi API với tọa độ
    enabled: !!(lat && lon), // Chỉ gọi khi có đủ lat và lon
    retry: 2,
  });
};

/**
 * Custom hook để lấy dự báo thời tiết theo tên thành phố
 *
 * @param {string} city - Tên thành phố
 * @returns {Object} - Object chứa data, loading, error từ React Query
 */
export const useForecast = (city) => {
  return useQuery({
    queryKey: ["forecast", city], // Key cache riêng cho forecast
    queryFn: () => getForecast(city), // Function gọi API forecast
    enabled: !!city, // Chỉ gọi khi có city
    retry: 2,
  });
};

/**
 * Custom hook để lấy dự báo thời tiết theo tọa độ GPS
 *
 * @param {number} lat - Vĩ độ
 * @param {number} lon - Kinh độ
 * @returns {Object} - Object chứa data, loading, error từ React Query
 */
export const useForecastByCoords = (lat, lon) => {
  return useQuery({
    queryKey: ["forecast", lat, lon], // Key cache theo tọa độ cho forecast
    queryFn: () => getForecastByCoords(lat, lon), // Function gọi API forecast với tọa độ
    enabled: !!(lat && lon), // Chỉ gọi khi có đủ tọa độ
    retry: 2,
  });
};

/**
 * Custom hook để lấy chỉ số chất lượng không khí (AQI) theo tọa độ GPS
 *
 * @param {number} lat - Vĩ độ
 * @param {number} lon - Kinh độ
 * @returns {Object} - Object chứa data, loading, error từ React Query
 */
export const useAQIByCoords = (lat, lon) => {
  return useQuery({
    queryKey: ["aqi", lat, lon],
    queryFn: () => getAQIByCoords(lat, lon),
    enabled: !!(lat && lon),
    retry: 1,
  });
};