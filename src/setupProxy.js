const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL,
      changeOrigin: true,
    }),
  );
};
