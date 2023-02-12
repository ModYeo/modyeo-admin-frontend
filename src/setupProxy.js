const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://skysrd.iptime.org:8080",
      changeOrigin: true,
    }),
  );
};
