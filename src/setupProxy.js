const { createProxyMiddleware } = require("http-proxy-middleware");

// This proxy redirects requests to /api endpoints to
// the Express server running on port 3001 when we're
// in `NODE_ENV=development` mode.
module.exports = function(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://127.0.0.1:3001/api",
      changeOrigin: true
    })
  );
};
