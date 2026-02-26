const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://nexus-77lm.onrender.com',
      changeOrigin: true,
      secure: false,
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).json({ 
          error: 'Backend server is unavailable',
          message: 'The backend server may be sleeping or down. Please try again in a few moments.'
        });
      }
    })
  );
};