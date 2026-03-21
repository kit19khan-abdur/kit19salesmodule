const { createProxyMiddleware } = require('http-proxy-middleware');

// Development proxy to forward API requests to the services API and avoid CORS issues
module.exports = function (app) {
  const target = process.env.REACT_APP_SERVICES_API_BASE_URL || 'https://services.kit19.com';

  // Existing campaign proxy (kept) -- points to kit19.com
  app.use(
    '/UserCRMCampaign',
    createProxyMiddleware({
      target: 'https://kit19.com',
      changeOrigin: true,
      secure: true,
      logLevel: 'warn',
    })
  );

  // Proxy UserCRM API calls to services API
  app.use(
    '/UserCRM',
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: false,
      logLevel: 'warn',
    })
  );

  // Proxy Common endpoints as well
  app.use(
    '/Common',
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: false,
      logLevel: 'warn',
    })
  );
};
