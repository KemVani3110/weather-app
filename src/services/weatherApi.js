import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = process.env.REACT_APP_WEATHER_BASE_URL;

const weatherApi = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric',
    lang: 'vi'
  }
});

export const getCurrentWeather = async (city) => {
  try {
    const response = await weatherApi.get('/weather', {
      params: { q: city }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy dữ liệu thời tiết');
  }
};

export const getWeatherByCoords = async (lat, lon) => {
  try {
    const response = await weatherApi.get('/weather', {
      params: { lat, lon }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy dữ liệu thời tiết');
  }
};

export const getForecast = async (city) => {
  try {
    const response = await weatherApi.get('/forecast', {
      params: { q: city }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy dự báo thời tiết');
  }
};