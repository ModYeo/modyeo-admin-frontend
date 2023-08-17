/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL,
      changeOrigin: true,
    }),
  );
  app.use(
    "/prod/modyeo-dev-image",
    createProxyMiddleware({
      target: process.env.REACT_APP_IMAGE_S3_URL,
      changeOrigin: true,
    }),
  );
};

/** DO NOT EDIT: cors 에러 우회용 프록시 서버 설정 파일 */
