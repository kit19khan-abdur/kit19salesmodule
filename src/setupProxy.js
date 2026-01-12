const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy ASMX/TriggerCampaign calls to kit19.com to avoid CORS/preflight redirect issues during development
  app.use(
    '/UserCRMCampaign',
    createProxyMiddleware({
      target: 'https://kit19.com',
      changeOrigin: true,
      secure: true,
      logLevel: 'warn'
    })
  );
};
