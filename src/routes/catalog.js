const app = require("express").Router();

const error = require("../structs/error.js");

app.get("/api/shared/bulk/offers", (req, res) => {
  const store = require("../../resources/store.json");
  res.json(store);
});

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "catalog").header)
    .status(404)
    .json(error.not_found(req, "catalog").error);
});

module.exports = app;
