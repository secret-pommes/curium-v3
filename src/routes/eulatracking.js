const app = require("express").Router();

const error = require("../structs/error.js");

app.get("/api/shared/agreements/fn", (req, res) => {
  const eula = require("../../resources/eula.json");
  res.json(eula);
});

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "eulatracking").header)
    .status(404)
    .json(error.not_found(req, "eulatracking").error);
});

module.exports = app;
