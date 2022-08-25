// module import -> npm install http-proxy-middleware
// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

// src/setupProxy.js
module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "10.150.151.125:8080", // 비즈니스 서버 URL 설정
      changeOrigin: true,
    })
  );
};
