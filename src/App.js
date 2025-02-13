import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import WeatherDisplay from './components/WeatherDisplay';
import CitySelector from './components/CitySelector';
import ErrorMessage from './components/ErrorMessage';
import './App.css';
import axios from 'axios';

// Используем полный URL с HTTPS
const API_KEY = '';
const BASE_URL = 'https://api.weatherapi.com/v1';

const CITIES = [
  { id: 1, name: 'Volgograd', label: 'Волгоград' },
  { id: 2, name: 'Moscow', label: 'Москва' },
  { id: 3, name: 'Paris', label: 'Париж' },
  { id: 4, name: 'New York', label: 'Нью-Йорк' },
  { id: 5, name: 'Tokyo', label: 'Токио' },
  { id: 6, name: 'Dubai', label: 'Дубай' },
  { id: 7, name: 'Sydney', label: 'Сидней' },
  { id: 8, name: 'Rome', label: 'Рим' },
  { id: 9, name: 'Berlin', label: 'Берлин' },
  { id: 10, name: 'Madrid', label: 'Мадрид' }
];

//  экземпляр axios
const weatherApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // таймаут 10 секунд
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

function App() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forecastDays, setForecastDays] = useState(1);

  const fetchWeather = useCallback(async (city) => {
    try {
      setLoading(true);
      setError(null);

      // Проверка API ключа
      if (!API_KEY || API_KEY === 'YOUR_WEATHER_API_KEY') {
        throw new Error('Please provide a valid API key in .env file');
      }

      // Делаем запрос через настроенный экземпляр axios
      const response = await weatherApi.get('/forecast.json', {
        params: {
          key: API_KEY,
          q: city,
          days: forecastDays,
          aqi: 'yes'
        }
      });

      // Проверяем наличие данных
      if (!response.data || !response.data.location) {
        throw new Error('No weather data available for this location');
      }

      setWeatherData(response.data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      
      if (axios.isAxiosError(err)) {
        // Обработка различных ошибок API
        if (err.response) {
          // Сервер ответил с ошибкой
          switch (err.response.status) {
            case 401:
              setError('Invalid API key. Please check your API key');
              break;
            case 400:
              setError(err.response.data.error?.message || 'Invalid city name');
              break;
            case 404:
              setError('Weather data not found for this location');
              break;
            case 429:
              setError('Too many requests. Please try again later');
              break;
            default:
              setError(`Server error: ${err.response.data.error?.message || err.message}`);
          }
        } else if (err.request) {
          // Запрос был сделан, но ответ не получен
          setError('No response from server. Please check your internet connection');
        } else {
          // Ошибка при настройке запроса
          setError('Error setting up the request');
        }
      } else {
        // Обработка не-axios ошибок
        setError(err.message || 'An unexpected error occurred');
      }
      
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, [forecastDays]);

  useEffect(() => {
    fetchWeather(selectedCity.name);
  }, [selectedCity, forecastDays, fetchWeather]);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="controls">
          <CitySelector 
            cities={CITIES}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
          />
          <div className="forecast-toggle">
            <button 
              className={`toggle-btn ${forecastDays === 1 ? 'active' : ''}`}
              onClick={() => setForecastDays(1)}
            >
              Today
            </button>
            <button 
              className={`toggle-btn ${forecastDays === 5 ? 'active' : ''}`}
              onClick={() => setForecastDays(5)}
            >
              5 Days
            </button>
          </div>
        </div>
        {error && <ErrorMessage message={error} />}
        {loading && (
          <div className="loader">
            <div className="loader-spinner"></div>
            <p>Loading weather data...</p>
          </div>
        )}
        {weatherData && <WeatherDisplay data={weatherData} forecastDays={forecastDays} />}
      </main>
    </div>
  );
}

export default App; 