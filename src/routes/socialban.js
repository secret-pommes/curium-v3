const app = require("express").Router();

const { verifyToken } = require("../structs/token.js");
const error = require("../structs/error.js");

app.get("/api/public/v1/:accountId", verifyToken, (req, res) => {
  res.json({
    bans: [],
    warnings: [],
  });
});

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "socialban").header)
    .status(404)
    .json(error.not_found(req, "socialban").error);
});

module.exports = app;
