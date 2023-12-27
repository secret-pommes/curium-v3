const app = require("express").Router();
const path = require("path");
const fs = require("fs");

const error = require("../structs/error.js");

app.get("/:type/:file", (req, res) => {
  const file = path.join(
    __dirname,
    `../../public/assets/${req.params.type}/${req.params.file}`
  );

  if (fs.existsSync(file)) {
    res.sendFile(file);
  } else {
    return res
      .set(error.not_found(req, "assets").header)
      .status(404)
      .json(error.not_found(req, "assets").error);
  }
});

module.exports = app;
