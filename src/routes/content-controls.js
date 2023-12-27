const app = require("express").Router();

app.get("/:accountId", (req, res) => {
  res.json({});
});

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "content-controls").header)
    .status(404)
    .json(error.not_found(req, "content-controls").error);
});

module.exports = app;
