import { useQuery } from '@tanstack/react-query';
import { getCurrentWeather, getWeatherByCoords, getForecast } from '../services/weatherApi';

export const useCurrentWeather = (city) => {
  return useQuery({
    queryKey: ['weather', city],
    queryFn: () => getCurrentWeather(city),
    enabled: !!city,
    retry: 2,
  });
};

export const useWeatherByCoords = (lat, lon) => {
  return useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => getWeatherByCoords(lat, lon),
    enabled: !!(lat && lon),
    retry: 2,
  });
};

export const useForecast = (city) => {
  return useQuery({
    queryKey: ['forecast', city],
    queryFn: () => getForecast(city),
    enabled: !!city,
    retry: 2,
  });
};