import React from 'react';
import './CitySelector.css';

function CitySelector({ cities, selectedCity, onCityChange }) {
  return (
    <div className="city-selector">
      <div className="city-grid">
        {cities.map(city => (
          <button
            key={city.id}
            className={`city-btn ${selectedCity.id === city.id ? 'active' : ''}`}
            onClick={() => onCityChange(city)}
          >
            {city.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CitySelector;