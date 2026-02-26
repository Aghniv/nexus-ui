import React, { useState, useEffect } from 'react';
import ApiHealthCheck from '../utils/ApiHealthCheck';
import './NetworkDiagnostics.css';

const NetworkDiagnostics = ({ onClose }) => {
  const [diagnostics, setDiagnostics] = useState({
    backendStatus: 'checking',
    errorDetails: null,
    timestamp: null,
  });

  useEffect(() => {
    const runDiagnostics = async () => {
      const healthCheck = await ApiHealthCheck.checkServerStatus();
      
      setDiagnostics({
        backendStatus: healthCheck.status,
        errorDetails: healthCheck.error || null,
        timestamp: healthCheck.timestamp || new Date().toISOString(),
      });
    };

    runDiagnostics();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return '✅';
      case 'offline':
        return '❌';
      case 'checking':
        return '⏳';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return '#22c55e';
      case 'offline':
        return '#ef4444';
      case 'checking':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="network-diagnostics">
      <div className="diagnostics-content">
        <div className="diagnostics-header">
          <h3>Network Diagnostics</h3>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        
        <div className="status-item">
          <span className="status-icon" style={{ color: getStatusColor(diagnostics.backendStatus) }}>
            {getStatusIcon(diagnostics.backendStatus)}
          </span>
          <div className="status-details">
            <span className="status-label">Backend Server:</span>
            <span className="status-value" style={{ color: getStatusColor(diagnostics.backendStatus) }}>
              {diagnostics.backendStatus.toUpperCase()}
            </span>
          </div>
        </div>

        {diagnostics.errorDetails && (
          <div className="error-details">
            <h4>Error Details:</h4>
            <p className="error-message">{diagnostics.errorDetails}</p>
          </div>
        )}

        <div className="diagnostics-info">
          <h4>Common Issues & Solutions:</h4>
          <ul>
            <li><strong>Server Offline:</strong> The backend server may be sleeping. Free Render servers sleep after 15 minutes of inactivity.</li>
            <li><strong>CORS Errors:</strong> The backend may not be configured to accept requests from your domain.</li>
            <li><strong>Network Issues:</strong> Check your internet connection or try refreshing the page.</li>
          </ul>
        </div>

        <div className="diagnostics-actions">
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Refresh Page
          </button>
          <p className="timestamp">
            Last checked: {new Date(diagnostics.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NetworkDiagnostics;