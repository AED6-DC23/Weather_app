import React from 'react';
import './WeatherDisplay.css';

function WeatherDisplay({ data, forecastDays }) {
  const { location, current, forecast } = data;

  
  return (
    <div className="weather-display">
      <div className="location-info">
        <h2>{location.name}</h2>
        <p>{location.country}</p>
      </div>

      <div className="current-weather">
        <div className="temperature">
          <span className="temp-value">{Math.round(current.temp_c)}°C</span>
          <span className="condition">{current.condition.text}</span>
        </div>
        <div className="weather-details">
          <div className="detail">
            <span>Humidity: </span>
            <span>{current.humidity}%</span>
          </div>
          <div className="detail">  
            <span>Wind: </span>
            <span>{current.wind_kph} km/h</span>
          </div>
          <div className="detail">
            <span>Feels like: </span>
            <span>{Math.round(current.feelslike_c)}°C</span>
          </div>
        </div>
      </div>

      {forecastDays > 1 && (
        <div className="forecast">
          {forecast.forecastday.map((day) => (
            <div key={day.date} className="forecast-day">
              <div className="date">{new Date(day.date).toLocaleDateString()}</div>
              <div className="day-temp">
                <span className="max">D: {Math.round(day.day.maxtemp_c)}°C</span> <br></br>
                <span className="min">N: {Math.round(day.day.mintemp_c)}°C</span>
              </div>
              <div className="condition">{day.day.condition.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeatherDisplay;