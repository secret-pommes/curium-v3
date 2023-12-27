const app = require("express").Router();

const error = require("../structs/error.js");

app.all("/api/v1/public/data", (req, res) => {
  if (req.method != "POST") {
    return res
      .set(error.method(req, "datarouter").header)
      .status(405)
      .json(error.method(req, "datarouter").error);
  }
  res.status(204).end();
});

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "datarouter").header)
    .status(404)
    .json(error.not_found(req, "datarouter").error);
});

module.exports = app;
