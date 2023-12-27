const app = require("express").Router();
//const uuid = require("uuid");

const error = require("../structs/error.js");

app.get("/api/waitingroom", (req, res) => {
  // re-added soon?
  /*if (global.backendCfg.activate_queue) {
    if (req.query.ticket) {
      return res.status(204).end();
    }

    let time = 61; // seconds

    if (global.queued_players.clients < 10) {
      time = 121;
    } else if (global.queued_players.clients < 20) {
      time = 241;
    } else if (global.queued_players.clients < 50) {
      time = 482;
    }

    return res.json({
      ticketId: uuid.v4(),
      expectedWait: time,
      retryTime: time,
      throttled: false,
    });
  }*/

  res.status(204).end();
});

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "waitingroom").header)
    .status(404)
    .json(error.not_found(req, "waitingroom").error);
});

module.exports = app;
