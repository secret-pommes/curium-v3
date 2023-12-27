const app = require("express").Router();
const crypto = require("crypto");
const uuid = require("uuid");

const log = require("../structs/log.js");
const error = require("../structs/error.js");
const User = require("../../model/user.js");
const {
  createToken,
  tokenToAccountId,
  verifyToken,
} = require("../structs/token.js");

Date.prototype.addHours = function (hours) {
  this.setTime(this.getTime() + hours * 60 * 60 * 1000);
  return this;
};

app.all("/api/oauth/token", async (req, res) => {
  if (req.method != "POST") {
    return res
      .set(error.method(req, "account").header)
      .status(405)
      .json(error.method(req, "account").error);
  }

  switch (req.body.grant_type) {
    case "client_credentials": {
      const token = req.headers["authorization"].replace("basic ", "");
      return res.json({
        access_token: `${req.body.token_type}~${token}`,
        expires_in: 28800,
        expires_at: new Date().addHours(8),
        token_type: req.body.token_type,
        client_id: tokenToAccountId(token),
        internal_client: true,
        client_service: "fortnite",
      });
    }
    case "password": {
      try {
        const user = await User.findOne({
          email: req.body.username,
          passcode: req.body.password,
        }).lean();
        const token = createToken(user.accountId);
        if (user.accountId) {
          return res.json({
            access_token: token,
            expires_in: 28800,
            expires_at: new Date().addHours(8),
            token_type: "bearer",
            refresh_token: `${token}_refresh`,
            refresh_expires: 86400,
            refresh_expires_at: new Date().addHours(24),
            account_id: user.accountId,
            client_id: `${token}_clientId`,
            internal_client: true,
            client_service: "fortnite",
            displayName: user.displayName,
            app: "fortnite",
            in_app_id: user.accountId,
            device_id: crypto.randomBytes(16).toString("hex"),
          });
        } else {
          return res
            .set(error.invalid_credentials(req, "account").header)
            .status(400)
            .json(error.invalid_credentials(req, "account").error);
        }
      } catch {
        return res
          .set(error.invalid_credentials(req, "account").header)
          .status(400)
          .json(error.invalid_credentials(req, "account").error);
      }
    }
    case "refresh_token": {
      let token;
      let user;

      try {
        token = JSON.stringify(req.body.refresh_token)
          .split("_refresh")[0]
          .replace('"', "");

        user = await User.findOne({ accountId: tokenToAccountId(token) });

        res.json({
          scope: "basic_profile friends_list openid presence",
          token_type: "bearer",
          access_token: token,
          expires_in: 28800,
          expires_at: new Date().addHours(8),
          refresh_token: `${token}_refresh`,
          refresh_expires_in: 86400,
          refresh_expires_at: new Date().addHours(24),
          account_id: user.accountId,
          client_id: token + "_clientId",
          application_id: "application_id",
          selected_account_id: user.accountId,
          id_token: token + "_id",
        });
      } catch {
        return res
          .set(error.refresh_missing(req, "account").header)
          .status(400)
          .json(error.refresh_missing(req, "account").error);
      }
    }
    default: {
      return res
        .set(error.oauth_unsupported_grand_type(req, "account").header)
        .status(400)
        .json(error.oauth_unsupported_grand_type(req, "account").error);
    }
  }
});

app.get("/api/public/account/:accountId", verifyToken, async (req, res) => {
  let user;

  try {
    user = await User.findOne({ accountId: req.params.accountId });
  } catch {
    return res
      .set(error.authorization_failed(req, "account").header)
      .status(401)
      .json(error.authorization_failed(req, "account").error);
  }

  res.json({
    id: req.params.accountId,
    displayName: user.displayName,
    name: user.displayName,
    email: `[hidden]${user.email.split("@")[1]}`,
    failedLoginAttempts: 0,
    lastLogin: new Date().toISOString(),
    numberOfDisplayNameChanges: 0,
    ageGroup: "UNKNOWN",
    headless: false,
    country: "US",
    lastName: "Server",
    preferredLanguage: "en",
    canUpdateDisplayName: false,
    tfaEnabled: false,
    emailVerified: true,
    minorVerified: false,
    minorExpected: false,
    minorStatus: "NOT_MINOR",
    cabinedMode: false,
    hasHashedEmail: false,
  });

  log.user(`${user.displayName} has logged in.`);
});

app.get("/api/public/account", verifyToken, async (req, res) => {
  if (!req.query.accountId) {
    return res
      .set(error.accountId_missing(req, "account").header)
      .status(401)
      .json(error.accountId_missing(req, "account").error);
  }

  let user;

  try {
    user = await User.findOne({ accountId: req.query.accountId }).lean();

    res.json([
      {
        id: user.accountId,
        displayName: user.displayName,
        externalAuths: {},
      },
    ]);
  } catch {
    return res
      .set(error.not_found(req, "account").header)
      .status(401)
      .json(error.not_found(req, "account").error);
  }
});

app.all("/api/oauth/sessions/kill/:token", (req, res) => {
  if (req.method != "DELETE") {
    return res
      .set(error.method(req, "account").header)
      .status(405)
      .json(error.method(req, "account"));
  }
  res.status(204).end();
});

app.all("/api/oauth/sessions/kill", (req, res) => {
  if (req.method != "DELETE") {
    return res
      .set(error.method(req, "account").header)
      .status(405)
      .json(error.method(req, "account"));
  }
  res.status(204).end();
});

app.get(
  "/api/public/account/:accountId/externalAuths",
  verifyToken,
  (req, res) => {
    res.json([]);
  }
);

app.get("/api/oauth/verify", verifyToken, async (req, res) => {
  const token = req.headers["authorization"].replace("bearer ", "");
  let user;

  try {
    user = await User.findOne({ accountId: tokenToAccountId(token) });
  } catch {
    return res
      .set(error.authorization_failed(req, "account").header)
      .status(401)
      .json(error.authorization_failed(req, "account").error);
  }

  res.json({
    token: token,
    session_id: crypto.randomBytes(16).toString("hex"),
    token_type: "bearer",
    client_id: token + "_clientId",
    internal_client: true,
    client_service: "fortnite",
    account_id: user.accountId,
    expires_in: 28800,
    expires_at: new Date().addHours(8),
    auth_method: "exchange_code",
    display_name: user.displayName,
    app: "fortnite",
    in_app_id: user.accountId,
    device_id: crypto.randomBytes(16).toString("hex"),
  });
});

app.get("/api/oauth/exchange", (req, res) => {
  res.json({ exchange_code: uuid.v4().replace("-", "") });
});

app.get("/api/epicdomains/ssodomains", (req, res) => {
  res.json([
    "fortnite.com",
    "epicgames.com",
    "unrealengine.com",
    "unrealtournament.com",
  ]);
});

app.get(
  "/api/public/account/displayName/:displayName",
  verifyToken,
  async (req, res) => {
    let user;
    try {
      user = await User.findOne({ displayName: req.params.displayName });

      res.json({
        id: user.accountId,
        displayName: user.displayName,
        externalAuths: {},
      });
    } catch {
      return res
        .set(error.authorization_failed(req, "account").header)
        .status(401)
        .json(error.authorization_failed(req, "account").error);
    }
  }
);

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "account").header)
    .status(401)
    .json(error.not_found(req, "account").error);
});

module.exports = app;
