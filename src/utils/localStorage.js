const SEARCH_HISTORY_KEY = 'weatherSearchHistory';
const MAX_HISTORY_ITEMS = 10;

export const getSearchHistory = () => {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Lỗi khi đọc lịch sử tìm kiếm:', error);
    return [];
  }
};

export const addToSearchHistory = (city) => {
  try {
    let history = getSearchHistory();
    
    // Xóa city nếu đã tồn tại
    history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
    
    // Thêm city mới vào đầu danh sách
    history.unshift(city);
    
    // Giới hạn số lượng items
    history = history.slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Lỗi khi lưu lịch sử tìm kiếm:', error);
  }
};

export const clearSearchHistory = () => {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Lỗi khi xóa lịch sử tìm kiếm:', error);
  }
};