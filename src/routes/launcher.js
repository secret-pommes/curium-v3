const app = require("express").Router();

const { verifyToken } = require("../structs/token.js");
const error = require("../structs/error.js");

app.get("/api/public/distributionpoints", verifyToken, (req, res) => {
  res.json({
    distributions: [
      "https://download.epicgames.com/",
      "https://download2.epicgames.com/",
      "https://download3.epicgames.com/",
      "https://download4.epicgames.com/",
      "https://epicgames-download1.akamaized.net/",
    ],
  });
});

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "launcher").header)
    .status(404)
    .json(error.not_found(req, "launcher").error);
});

module.exports = app;
