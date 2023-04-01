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

/** DO NOT EDIT: cors 에러 우회용 프록시 서버 설정 파일 */
