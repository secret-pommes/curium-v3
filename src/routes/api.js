const app = require("express").Router();

const error = require("../structs/error.js");

Date.prototype.addHours = function (hours) {
  this.setTime(this.getTime() + hours * 60 * 60 * 1000);
  return this;
};

app.get("/v1/access/fortnite/*", (req, res) => {
  res.json({});
});

app.get("/v1/events/Fortnite/download/:accountId", (req, res) => {
  res.json({
    events: [
      {
        gameId: "Fortnite",
        eventId: "SwitchMPRelease",
        regions: ["EU"],
        regionMappings: {},
        platforms: [
          "XboxOneGDK",
          "PS4",
          "XboxOne",
          "XSX",
          "Android",
          "PS5",
          "Switch",
          "Windows",
        ],
        platformMappings: {},
        displayDataId: "SwitchMP Release!",
        eventGroup: "",
        announcementTime: "2019-01-29T08:00:00.000Z",
        appId: null,
        environment: null,
        metadata: {
          minimumAccountLevel: 0,
        },
        eventWindows: [
          {
            eventWindowId: "Tournament_Event1",
            eventTemplateId: "EventTemplate_Tournament",
            countdownBeginTime: "2018-01-01T01:00:00.000Z",
            beginTime: "2018-01-01T01:00:00.000Z",
            endTime: new Date().addHours(50),
            blackoutPeriods: [],
            round: 0,
            payoutDelay: 0,
            isTBD: false,
            canLiveSpectate: false,
            scoreLocations: [],
            visibility: "unlocked",
            requireAllTokens: [],
            requireAnyTokens: [],
            requireNoneTokensCaller: [],
            requireAllTokensCaller: [],
            requireAnyTokensCaller: [],
            additionalRequirements: [],
            teammateEligibility: "all",
            metadata: {
              ServerReplays: true,
              RoundType: "Qualifiers",
            },
          },
        ],
        beginTime: "2021-01-01T01:00:00.000Z",
        endTime: "9999-01-01T01:00:00.000Z",
      },
    ],
    player: {},
    scores: [],
    templates: [
      {
        gameId: "Fortnite",
        eventTemplateId: "EventTemplate_Tournament",
        playlistId: "Playlist_Playground",
        matchCap: 0,
        liveSessionAttributes: [],
        scoringRules: [],
      },
    ],
  });
});

app.all("/v1/user/setting", (req, res) => {
  if (req.method != "POST") {
    return res
      .set(error.method(req, "api").header)
      .status(404)
      .json(error.method(req, "api").error);
  }
  res.json({});
});

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "api").header)
    .status(404)
    .json(error.not_found(req, "api").error);
});

module.exports = app;
