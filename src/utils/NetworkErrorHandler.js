// Network Error Handler Utility
export const handleNetworkError = (error, componentName = 'Component') => {
  console.error(`Network error in ${componentName}:`, error);
  
  if (error.response) {
    // Server responded with error status
    return {
      type: 'server-error',
      message: error.response.data?.message || `Server error: ${error.response.status}`,
      status: error.response.status,
      details: error.response.data
    };
  } else if (error.request) {
    // Request made but no response received
    if (error.message.includes('timeout')) {
      return {
        type: 'timeout',
        message: 'Request timed out. The server may be slow or unavailable.'
      };
    } else if (error.message.includes('Network Error')) {
      return {
        type: 'network-error',
        message: 'Network error. Please check your internet connection.'
      };
    } else {
      return {
        type: 'no-response',
        message: 'Server is not responding. The backend may be sleeping or down.'
      };
    }
  } else {
    // Something else happened
    return {
      type: 'unknown-error',
      message: error.message || 'An unexpected error occurred.'
    };
  }
};

// Retry utility with exponential backoff
export const retryRequest = async (requestFunc, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFunc();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff: wait longer each time
      const waitTime = delay * Math.pow(2, i);
      console.log(`Retry ${i + 1}/${maxRetries} after ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

// Check if backend is likely sleeping (Render free tier behavior)
export const isBackendSleeping = (error) => {
  return (
    error.type === 'no-response' || 
    (error.status >= 500 && error.status < 600) ||
    error.message.includes('sleeping') ||
    error.message.includes('not responding')
  );
};

// Get user-friendly error message
export const getUserFriendlyMessage = (error) => {
  if (isBackendSleeping(error)) {
    return 'Our payment server is currently starting up. This usually takes 30-60 seconds. Please try again in a moment.';
  }
  
  switch (error.type) {
    case 'server-error':
      return 'There was a problem with our server. Please try again later.';
    case 'timeout':
      return 'The request is taking too long. Please try again.';
    case 'network-error':
      return 'Please check your internet connection and try again.';
    default:
      return error.message || 'Something went wrong. Please try again.';
  }
};