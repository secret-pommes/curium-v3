const app = require("express").Router();

const error = require("../structs/error.js");
const { verifyToken } = require("../structs/token.js");

app.all(
  "/api/v1/_/:accountId/settings/subscriptions",
  verifyToken,
  (req, res) => {
    if (req.method != "PATCH") {
      return res
        .set(error.method(req, "presence").header)
        .status(405)
        .json(error.method(req, "presence").error);
    }
    
    res.json({});
  }
);

app.get("/api/v1/_/:accountId/last-online", verifyToken, (req, res) => {
  res.json({});
});

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "presence").header)
    .status(404)
    .json(error.not_found(req, "presence").error);
});

module.exports = app;
