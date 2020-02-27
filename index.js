const app = require("./backend");
const express = require("express");

if (process.env["NODE_ENV"] === "development") {
  const { createProxyMiddleware } = require('http-proxy-middleware');
  app.use("/*", createProxyMiddleware({ target: "http://localhost:3001", changeOrigin: true, ws: true }));
}

app.use(express.static("frontend/build"));
app.get("/*", (req, res) => res.sendFile("frontend/build/index.html", { root: __dirname }));
