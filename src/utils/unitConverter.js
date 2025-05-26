export const convertTemperature = (celsius, unit) => {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9/5) + 32);
  }
  return Math.round(celsius);
};

export const convertWindSpeed = (meterPerSecond) => {
  return Math.round(meterPerSecond * 3.6); // Convert m/s to km/h
};

export const getTemperatureUnit = (unit) => {
  return unit === 'celsius' ? '°C' : '°F';
};