import React from 'react';
import './PaymentFallback.css';

const PaymentFallback = ({ bookingReference, amount, onRetry }) => {
  return (
    <div className="payment-fallback">
      <div className="fallback-content">
        <div className="fallback-icon">⚠️</div>
        <h3>Payment Service Unavailable</h3>
        <p>The payment server is temporarily unavailable. This is likely because:</p>
        <ul>
          <li>The server is starting up (takes 30-60 seconds on free tier)</li>
          <li>The server is sleeping due to inactivity</li>
          <li>There are network connectivity issues</li>
        </ul>
        <div className="fallback-actions">
          <button onClick={onRetry} className="retry-button">
            Try Again
          </button>
          <p className="fallback-note">
            If the problem persists, please contact support or try again later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFallback;