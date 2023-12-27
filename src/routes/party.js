const app = require("express").Router();
const uuid = require("uuid");

const { verifyToken } = require("../structs/token");
const error = require("../structs/error.js");

app.get(
  "/api/v1/Fortnite/user/:accountId/notifications/undelivered/count",
  verifyToken,
  (req, res) => {
    res.json({ invites: 0, pings: 0 });
  }
);

app.get("/api/v1/Fortnite/user/:accountId", verifyToken, (req, res) => {
  res.json({
    current: [],
    pending: [],
    invites: [],
    pings: [],
  });
});

app.all("/api/v1/Fortnite/parties", verifyToken, (req, res) => {
  if (req.method != "POST") {
    return res
      .set(error.method(req, "party").header)
      .status(405)
      .json(error.method(req, "party").error);
  }

  if (!req.body.join_info || !req.body.join_info.connection) {
    return res.json({});
  }

  res.json({
    id: uuid.v4().replace(/-/gi, ""),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    config: {
      type: "DEFAULT",
      discoverability: "ALL",
      sub_type: "default",
      invite_ttl: 14400,
      intention_ttl: 60,
    },
    members: [
      {
        account_id: (req.body.join_info.connection.id || "").split("@prod")[0],
        meta: req.body.join_info.meta || {},
        connections: [
          {
            id: req.body.join_info.connection.id || "unknown",
            connected_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            yield_leadership: false,
            meta: req.body.join_info.connection.meta || {},
          },
        ],
        revision: 0,
        updated_at: new Date().toISOString(),
        joined_at: new Date().toISOString(),
        role: "CAPTAIN",
      },
    ],
    applicants: [],
    meta: req.body.meta || {},
    invites: [],
    revision: 0,
    intentions: [],
  });
});

app.use((req, res, next) => {
  res.status(204).end();
});

module.exports = app;
