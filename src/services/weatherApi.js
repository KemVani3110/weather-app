import axios from "axios";

// Lấy API key và base URL từ environment variables trong file .env
// Đảm bảo rằng các biến này được định nghĩa trong file .env của bạn
// Ví dụ: REACT_APP_WEATHER_API_KEY="your_api_key_here"
//         REACT_APP_WEATHER_BASE_URL="https://api.openweathermap.org/data/2.5"
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = process.env.REACT_APP_WEATHER_BASE_URL;

/**
 * @description Hàm tiện ích để ném lỗi tùy chỉnh.
 * Giúp tập trung logic xử lý lỗi vào một nơi duy nhất.
 * @param {object} error - Đối tượng lỗi từ Axios.
 * @param {string} defaultMessage - Thông báo lỗi mặc định nếu không có thông báo từ API.
 * @throws {Error} - Ném một đối tượng Error với thông báo phù hợp.
 */
const throwApiError = (error, defaultMessage) => {
  // Ưu tiên thông báo lỗi từ phản hồi của API (nếu có), nếu không sử dụng thông báo mặc định.
  throw new Error(error.response?.data?.message || defaultMessage);
};

/**
 * @description Tạo axios instance với cấu hình mặc định cho OpenWeatherMap API.
 * - baseURL: URL gốc của OpenWeatherMap API (ví dụ: https://api.openweathermap.org/data/2.5)
 * - params mặc định:
 * + appid: API key để xác thực.
 * + units: 'metric' để nhận nhiệt độ theo độ C và các đơn vị metric khác.
 * + lang: 'vi' để nhận mô tả thời tiết bằng tiếng Việt.
 */
const weatherApi = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: "metric", // Sử dụng đơn vị metric (°C, m/s, etc.)
    lang: "vi", // Ngôn ngữ tiếng Việt cho descriptions
  },
});

/**
 * @description API cơ sở để gửi yêu cầu GET đến OpenWeatherMap.
 * Các hàm API cụ thể sẽ gọi hàm này để tránh lặp lại logic `try...catch` và `throwApiError`.
 * @param {string} endpoint - Điểm cuối API (ví dụ: '/weather', '/forecast', '/air_pollution').
 * @param {object} params - Các tham số truy vấn bổ sung cho yêu cầu.
 * @param {string} errorMessage - Thông báo lỗi mặc định cho trường hợp cụ thể này.
 * @returns {Promise<object>} - Promise chứa dữ liệu phản hồi từ OpenWeatherMap.
 * @throws {Error} - Ném lỗi với message từ API hoặc message mặc định thông qua `throwApiError`.
 */
const fetchData = async (endpoint, params, errorMessage) => {
  try {
    const response = await weatherApi.get(endpoint, { params });
    return response.data;
  } catch (error) {
    throwApiError(error, errorMessage);
  }
};

/**
 * @description API lấy thời tiết hiện tại theo tên thành phố.
 * Endpoint: /weather với query parameter 'q' (city name).
 * @param {string} city - Tên thành phố cần tra cứu.
 * @returns {Promise<object>} - Promise chứa dữ liệu thời tiết từ OpenWeatherMap.
 * @throws {Error} - Ném lỗi với message từ API hoặc message mặc định.
 */
export const getCurrentWeather = async (city) => {
  return fetchData(
    "/weather",
    { q: city },
    "Không thể lấy dữ liệu thời tiết hiện tại"
  );
};

/**
 * @description API lấy thời tiết hiện tại theo tọa độ GPS.
 * Endpoint: /weather với query parameters 'lat' và 'lon'.
 * @param {number} lat - Vĩ độ (latitude).
 * @param {number} lon - Kinh độ (longitude).
 * @returns {Promise<object>} - Promise chứa dữ liệu thời tiết từ OpenWeatherMap.
 * @throws {Error} - Ném lỗi với message từ API hoặc message mặc định.
 */
export const getWeatherByCoords = async (lat, lon) => {
  return fetchData(
    "/weather",
    { lat, lon },
    "Không thể lấy dữ liệu thời tiết hiện tại theo tọa độ"
  );
};

/**
 * @description API lấy dự báo thời tiết 5 ngày theo tên thành phố.
 * Endpoint: /forecast với query parameter 'q' (city name).
 * Trả về dự báo 3 giờ một lần trong 5 ngày (tối đa 40 data points).
 * @param {string} city - Tên thành phố cần tra cứu.
 * @returns {Promise<object>} - Promise chứa dữ liệu dự báo từ OpenWeatherMap.
 * @throws {Error} - Ném lỗi với message từ API hoặc message mặc định.
 */
export const getForecast = async (city) => {
  return fetchData("/forecast", { q: city }, "Không thể lấy dự báo thời tiết");
};

/**
 * @description API lấy dự báo thời tiết 5 ngày theo tọa độ GPS.
 * Endpoint: /forecast với query parameters 'lat' và 'lon'.
 * Trả về dự báo 3 giờ một lần trong 5 ngày (tối đa 40 data points).
 * @param {number} lat - Vĩ độ (latitude).
 * @param {number} lon - Kinh độ (longitude).
 * @returns {Promise<object>} - Promise chứa dữ liệu dự báo từ OpenWeatherMap.
 * @throws {Error} - Ném lỗi với message từ API hoặc message mặc định.
 */
export const getForecastByCoords = async (lat, lon) => {
  return fetchData(
    "/forecast",
    { lat, lon },
    "Không thể lấy dự báo thời tiết theo tọa độ"
  );
};

/**
 * @description API lấy chỉ số chất lượng không khí (AQI) theo tọa độ GPS.
 * Endpoint: /air_pollution với query parameters 'lat' và 'lon'.
 * Trả về dữ liệu AQI hiện tại tại vị trí chỉ định.
 * @param {number} lat - Vĩ độ (latitude).
 * @param {number} lon - Kinh độ (longitude).
 * @returns {Promise<number>} - Promise chứa chỉ số AQI (giá trị từ 1 đến 5).
 * @throws {Error} - Ném lỗi với message từ API hoặc message mặc định.
 */
export const getAQIByCoords = async (lat, lon) => {
  const data = await fetchData(
    "/air_pollution",
    { lat, lon },
    "Không thể lấy dữ liệu chất lượng không khí"
  );
  // Đảm bảo rằng cấu trúc dữ liệu tồn tại trước khi truy cập
  if (data && data.list && data.list.length > 0 && data.list[0].main) {
    return data.list[0].main.aqi;
  }
  // Nếu dữ liệu không hợp lệ, ném lỗi rõ ràng
  throw new Error(
    "Dữ liệu chất lượng không khí không hợp lệ hoặc không tìm thấy."
  );
};
