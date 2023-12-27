const app = require("express").Router();

const { verifyToken } = require("../structs/token.js");
const error = require("../structs/error.js");

app.get("/", verifyToken, (req, res) => {
  let server = global.backendCfg.shop.VbucksShop.website;
  try {
    if (global.backendCfg.shop.VbucksShop.website.includes("SERVER_PORT")) {
      server = global.backendCfg.shop.VbucksShop.website.replace(
        "SERVER_PORT",
        global.backendCfg.port
      );
    }
  } catch {
    return res
      .set(error.server_error(req, "purchase").header)
      .status(500)
      .json(error.server_error(req, "purchase").error);
  }

  res.redirect(server);
});

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "purchase").header)
    .status(404)
    .json(error.not_found(req, "purchase").error);
});

module.exports = app;
