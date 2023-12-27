const app = require("express").Router();

const { tokenToAccountId, verifyToken } = require("../structs/token.js");
const User = require("../../model/user.js");
const error = require("../structs/error.js");

app.get("/api/service/Fortnite/status", verifyToken, async (req, res) => {
  let user;

  try {
    user = await User.findOne({
      accountId: tokenToAccountId(
        req.headers["authorization"].replace("bearer ", "")
      ),
    });
  } catch {
    return res
      .set(error.authorization_failed(req, "lightswitch").header)
      .status(400)
      .json(error.authorization_failed(req, "lightswitch").error);
  }

  let status;
  let message;

  if (!global.serverCfg.maintenance) {
    status = "UP";
    message = "Fortnite is online";
  } else {
    status = "DOWN";
    message = "Fortnite is offline for maintenance";
  }

  res.json({
    serviceInstanceId: "fortnite",
    status: status,
    message: message,
    maintenanceUri: null,
    overrideCatalogIds: ["a7f138b2e51945ffbfdacc1af0541053"],
    allowedActions: [],
    banned: user.banned,
    launcherInfoDTO: {
      appName: "Fortnite",
      catalogItemId: "4fe75bbc5a674f4f9b356b5c90567da5",
      namespace: "fn",
    },
  });
});

app.get("/api/service/bulk/status", verifyToken, async (req, res) => {
  let user;

  try {
    user = await User.findOne({
      accountId: tokenToAccountId(
        req.headers["authorization"].replace("bearer ", "")
      ),
    });
  } catch {
    return res
      .set(error.authorization_failed(req, "lightswitch").header)
      .status(400)
      .json(error.authorization_failed(req, "lightswitch").error);
  }

  let status;
  let message;

  if (!global.backendCfg.maintenance) {
    status = "UP";
    message = "fortnite is up";
  } else {
    status = "DOWN";
    message = "fortnite is down for maintenance";
  }

  res.json([
    {
      serviceInstanceId: "fortnite",
      status: status,
      message: message,
      maintenanceUri: null,
      overrideCatalogIds: ["a7f138b2e51945ffbfdacc1af0541053"],
      allowedActions: ["PLAY", "DOWNLOAD"],
      banned: user.banned,
      launcherInfoDTO: {
        appName: "Fortnite",
        catalogItemId: "4fe75bbc5a674f4f9b356b5c90567da5",
        namespace: "fn",
      },
    },
  ]);
});

app.use((req, res, next) => {
  return res
    .set(error.not_found(req, "lightswitch").header)
    .status(400)
    .json(error.not_found(req, "lightswitch").error);
});

module.exports = app;
