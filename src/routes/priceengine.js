const app = require("express").Router();

const { verifyToken } = require("../structs/token.js");
const error = require("../structs/error.js");

app.all("/api/shared/offers/price", verifyToken, (req, res) => {
  if (req.method != "POST") {
    return res
      .set(error.method(req, "priceengine").header)
      .status(405)
      .json(error.method(req, "priceengine").error);
  }

  res.json({});
});

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "priceengine").header)
    .status(404)
    .json(error.not_found(req, "priceengine").error);
});

module.exports = app;
