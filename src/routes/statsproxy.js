const app = require("express").Router();

const { verifyToken } = require("../structs/token.js");
const error = require("../structs/error.js");

app.get("/api/statsv2/account/:accountId", verifyToken, async (req, res) => {
  res.json({
    startTime: 0,
    endTime: 9223372036854775807,
    stats: {
      br_kills_keyboardmouse_m0_playlist_defaultduo: 0,
      br_kills_keyboardmouse_m0_playlist_defaultsolo: 11,
      br_kills_keyboardmouse_m0_playlist_defaultsquad: 0,
      br_kills_keyboardmouse_m0_playlist_showdown_trios: 0,
      br_matchesplayed_keyboardmouse_m0_playlist_defaultduo: 0,
      br_matchesplayed_keyboardmouse_m0_playlist_defaultsolo: 0,
      br_matchesplayed_keyboardmouse_m0_playlist_defaultsquad: 0,
      br_matchesplayed_keyboardmouse_m0_playlist_showdown_trios: 0,
      br_minutesplayed_keyboardmouse_m0_playlist_defaultduo: 0,
      br_minutesplayed_keyboardmouse_m0_playlist_defaultsolo: 0,
      br_minutesplayed_keyboardmouse_m0_playlist_defaultsquad: 0,
      br_minutesplayed_keyboardmouse_m0_playlist_showdown_trios: 0,
      br_placetop10_keyboardmouse_m0_playlist_defaultsolo: 0,
      br_placetop12_keyboardmouse_m0_playlist_defaultduo: 0,
      br_placetop1_keyboardmouse_m0_playlist_defaultduo: 0,
      br_placetop1_keyboardmouse_m0_playlist_defaultsolo: 0,
      br_placetop25_keyboardmouse_m0_playlist_defaultsolo: 0,
      br_placetop3_keyboardmouse_m0_playlist_showdown_trios: 0,
      br_placetop5_keyboardmouse_m0_playlist_defaultduo: 0,
      br_placetop6_keyboardmouse_m0_playlist_showdown_trios: 0,
      br_playersoutlived_keyboardmouse_m0_playlist_defaultduo: 0,
      br_playersoutlived_keyboardmouse_m0_playlist_defaultsolo: 0,
      br_playersoutlived_keyboardmouse_m0_playlist_defaultsquad: 0,
      br_playersoutlived_keyboardmouse_m0_playlist_showdown_trios: 0,
      br_score_keyboardmouse_m0_playlist_defaultduo: 0,
      br_score_keyboardmouse_m0_playlist_defaultsolo: 0,
      br_score_keyboardmouse_m0_playlist_defaultsquad: 0,
      br_score_keyboardmouse_m0_playlist_showdown_trios: 0,
    },
    accountId: req.params.accountId,
  });
});

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "statsproxy").header)
    .status(404)
    .json(error.not_found(req, "statsproxy").error);
});

module.exports = app;
