import React from 'react';
import './ErrorMessage.css';

function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      <i className="fas fa-exclamation-circle"></i>
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;