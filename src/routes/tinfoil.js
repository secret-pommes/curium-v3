const app = require("express").Router();

const error = require("../structs/error.js");

app.get("/", (req, res) => {
  let tinfoil = JSON.stringify(require("../../resources/tinfoil.json"));

  try {
    if (tinfoil.includes("SERVER_PORT")) {
      return res.json(
        JSON.parse(tinfoil.replace("SERVER_PORT", global.backendCfg.port))
      );
    }
  } catch {
    return res
      .set(error.server_error(req, "tinfoil").header)
      .status(500)
      .json(error.server_error(req, "tinfoil").header);
  }

  if (!global.backendCfg.tinfoil_server.active) {
    return res
      .set(
        error.custom(
          req,
          "tinfoil",
          "currently_unavailable",
          null,
          "This service is currently not avaiable.",
          "tinfoil"
        ).header
      )
      .status(404)
      .json(
        error.custom(
          req,
          "auth",
          "currently_unavailable",
          null,
          "This service is currently not avaiable.",
          "tinfoil"
        ).error
      );
  }

  res.json(JSON.parse(tinfoil));
});

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "tinfoil").header)
    .status(404)
    .json(error.not_found(req, "tinfoil").error);
});

module.exports = app;
