const app = require("express").Router();

const { verifyToken } = require("../structs/token.js");
const error = require("../structs/error.js");

app.get("/api/public/friends/:accountId", verifyToken, (req, res) => {
  res.json([]);
});

app.get("/api/public/blocklist/:accountId", verifyToken, (req, res) => {
  res.json({ blockedUsers: [] });
});

app.get("/api/v1/:accountId/blocklist", verifyToken, (req, res) => {
  res.json({ blockedUsers: [] });
});

app.get("/api/v1/:accountId/summary", verifyToken, (req, res) => {
  res.json([]);
});

app.get("/api/v1/:accountId/recent/fortnite", verifyToken, (req, res) => {
  res.json([]);
});

app.get("/api/v1/:accountId/settings", verifyToken, (req, res) => {
  res.json({ acceptInvites: "public", mutualPrivacy: "ALL" });
});

app.get(
  "/api/public/list/fortnite/:accountId/recentPlayers",
  verifyToken,
  (req, res) => {
    res.json([]);
  }
);

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "friends").header)
    .status(404)
    .json(error.not_found(req, "friends").error);
});

module.exports = app;
