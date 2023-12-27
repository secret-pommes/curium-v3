const app = require("express").Router();

const error = require("../structs/error.js");

app.all("/api/tracking/:server", (req, res) => {
  if (req.method != "POST") {
    return res
      .set(error.method(req, "dedicated-server").header)
      .status(405)
      .json(error.method(req, "dedicated-server").error);
  }

  console.log(
    "[DEBUG] INFO FROM DEDICATED_SERVER: " + JSON.stringify(req.body)
  );

  res.status(204).end();
});

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "dedicated-server").header)
    .status(404)
    .json(error.not_found(req, "dedicated-server").error);
});

module.exports = app;
