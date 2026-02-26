// API Health Check Utility
class ApiHealthCheck {
  static async checkBackendHealth() {
    try {
      const response = await fetch('https://nexus-77lm.onrender.com/api/health', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        return { status: 'healthy', message: 'Backend is responding' };
      } else {
        return { status: 'error', message: `Backend returned ${response.status}` };
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('CORS')) {
        return { status: 'cors-error', message: 'CORS policy blocking requests' };
      } else if (error.message.includes('Failed to fetch')) {
        return { status: 'network-error', message: 'Backend server is not responding' };
      } else {
        return { status: 'unknown-error', message: error.message };
      }
    }
  }

  static async checkServerStatus() {
    try {
      // Try a simple endpoint that should always be available
      const response = await fetch('https://nexus-77lm.onrender.com/api/rooms/types', {
        method: 'GET',
        mode: 'cors',
        timeout: 10000, // 10 second timeout
      });
      
      return {
        status: response.ok ? 'online' : 'offline',
        statusCode: response.status,
        responseTime: Date.now(),
      };
    } catch (error) {
      return {
        status: 'offline',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export default ApiHealthCheck;