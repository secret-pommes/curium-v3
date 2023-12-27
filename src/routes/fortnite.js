const app = require("express").Router();
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const uuid = require("uuid");

const { tokenToAccountId, verifyToken } = require("../structs/token.js");
const { rawBody, fnVersion } = require("../structs/structures.js");

const error = require("../structs/error.js");
const User = require("../../model/user.js");
const Athena = require("../../model/athena.js");
const Friends = require("../../model/friends.js");
const log = require("../structs/log.js");

let buildIds = {};

Date.prototype.addHours = function (hours) {
  this.setTime(this.getTime() + hours * 60 * 60 * 1000);
  return this;
};

app.get("/api*/versioncheck*", (req, res) => {
  res.json({ type: "NO_UPDATE" });
});

app.get("/api/cloudstorage/system", (req, res) => {
  const location = path.join(__dirname, "../../resources/hotfixes");
  let files = [];

  fs.readdirSync(location).forEach((filename) => {
    if (filename.toLowerCase().endsWith(".ini")) {
      files.push({
        uniqueFilename: filename,
        filename: filename,
        hash: crypto
          .createHash("sha1")
          .update(fs.readFileSync(path.join(location, filename).toString()))
          .digest("hex"),
        hash256: crypto
          .createHash("sha256")
          .update(fs.readFileSync(path.join(location, filename).toString()))
          .digest("hex"),
        length: (path.join(location, filename), "utf-8").length,
        contentType: "application/octet-stream",
        uploaded: fs.statSync(path.join(location, filename)).mtime,
        storageType: "S3",
        storageIds: {},
        doNotCache: true,
      });
    }
  });

  res.json(files);
});

app.get("/api/cloudstorage/system/config", verifyToken, (req, res) => {
  res.json({
    lastUpdated: new Date().toISOString(),
    disableV2: false,
    isAuthenticated: true,
    enumerateFilesPath: "/api/cloudstorage/system",
    enableMigration: false,
    enableWrites: false,
    epicAppName: "Live",
    transports: {
      McpProxyTransport: {
        name: "McpProxyTransport",
        type: "ProxyStreamingFile",
        appName: "fortnite",
        isEnabled: false,
        isRequired: true,
        isPrimary: true,
        timeoutSeconds: 30,
        priority: 10,
      },
      McpSignatoryTransport: {
        name: "McpSignatoryTransport",
        type: "ProxySignatory",
        appName: "fortnite",
        isEnabled: false,
        isRequired: false,
        isPrimary: false,
        timeoutSeconds: 30,
        priority: 20,
      },
      DssDirectTransport: {
        name: "DssDirectTransport",
        type: "DirectDss",
        appName: "fortnite",
        isEnabled: true,
        isRequired: false,
        isPrimary: false,
        timeoutSeconds: 30,
        priority: 30,
      },
    },
  });
});

app.get(
  "/api/cloudstorage/storage/:accountId/info",
  verifyToken,
  async (req, res) => {
    res.json({
      accountId: req.params.accountId,
      totalStorage: 9223372036854775807,
      totalUsed: 0,
    });
  }
);

app.get("/api/cloudstorage/system/:file", (req, res) => {
  const location = path.join(
    __dirname,
    `../../resources/hotfixes/${req.params.file}`
  );

  if (fs.existsSync(location)) {
    res.sendFile(location);
  } else {
    return res
      .set(error.not_found(req, "fortnite").header)
      .status(404)
      .json(error.not_found(req, "fortnite").header);
  }
});

app.get("/api/cloudstorage/user/config", verifyToken, (req, res) => {
  res.json({
    lastUpdated: new Date().toISOString(),
    disableV2: true,
    isAuthenticated: true,
    enumerateFilesPath: "/api/cloudstorage/user",
    enableMigration: false,
    enableWrites: true,
    epicAppName: "Live",
    transports: {
      McpProxyTransport: {
        name: "McpProxyTransport",
        type: "ProxyStreamingFile",
        appName: "fortnite",
        isEnabled: true,
        isRequired: true,
        isPrimary: true,
        timeoutSeconds: 30,
        priority: 10,
      },
      McpSignatoryTransport: {
        name: "McpSignatoryTransport",
        type: "ProxySignatory",
        appName: "fortnite",
        isEnabled: false,
        isRequired: false,
        isPrimary: false,
        timeoutSeconds: 30,
        priority: 20,
      },
      DssDirectTransport: {
        name: "DssDirectTransport",
        type: "DirectDss",
        appName: "fortnite",
        isEnabled: false,
        isRequired: false,
        isPrimary: false,
        timeoutSeconds: 30,
        priority: 30,
      },
    },
  });
});

app.get("/api/cloudstorage/user/:accountId", verifyToken, async (req, res) => {
  res.set("Content-Type", "application/json");
  let platform;

  const { season } = fnVersion(req);

  try {
    platform = req.headers["user-agent"]
      .split(" ")[1]
      .split("/")[0]
      .toLowerCase();
  } catch {
    platform = "windows";
  }

  const saveDir = path.join(
    __dirname,
    `../../ClientSettings/${req.params.accountId}/ClientSettings_S${season}.Sav`
  );

  if (fs.existsSync(saveDir)) {
    if (platform == "windows") {
      return res.json([
        {
          uniqueFilename: "ClientSettings.Sav",
          filename: "ClientSettings.Sav",
          hash: crypto
            .createHash("sha1")
            .update(fs.readFileSync(saveDir, "latin1"))
            .digest("hex"),
          hash256: crypto
            .createHash("sha256")
            .update(fs.readFileSync(saveDir, "latin1"))
            .digest("hex"),
          length: Buffer.byteLength(fs.readFileSync(saveDir, "latin1")),
          contentType: "application/octet-stream",
          uploaded: fs.statSync(saveDir).mtime,
          storageType: "S3",
          storageIds: {},
          accountId: req.params.accountId,
          doNotCache: false,
        },
      ]);
    } else if (platform == "switch") {
      return res.json([
        {
          uniqueFilename: "ClientSettingsSwitch.Sav",
          filename: "ClientSettingsSwitch.Sav",
          hash: crypto
            .createHash("sha1")
            .update(fs.readFileSync(saveDir, "latin1"))
            .digest("hex"),
          hash256: crypto
            .createHash("sha256")
            .update(fs.readFileSync(saveDir, "latin1"))
            .digest("hex"),
          length: Buffer.byteLength(fs.readFileSync(saveDir, "latin1")),
          contentType: "application/octet-stream",
          uploaded: fs.statSync(saveDir).mtime,
          storageType: "S3",
          storageIds: {},
          accountId: req.params.accountId,
          doNotCache: false,
        },
      ]);
    } else if (platform == "android") {
      return res.json([
        {
          uniqueFilename: "ClientSettingsAndroid.Sav",
          filename: "ClientSettingsAndroid.Sav",
          hash: crypto
            .createHash("sha1")
            .update(fs.readFileSync(saveDir, "latin1"))
            .digest("hex"),
          hash256: crypto
            .createHash("sha256")
            .update(fs.readFileSync(saveDir, "latin1"))
            .digest("hex"),
          length: Buffer.byteLength(fs.readFileSync(saveDir, "latin1")),
          contentType: "application/octet-stream",
          uploaded: fs.statSync(saveDir).mtime,
          storageType: "S3",
          storageIds: {},
          accountId: req.params.accountId,
          doNotCache: false,
        },
      ]);
    } else if (platform == "ios") {
      return res.json([
        {
          uniqueFilename: "ClientSettingsIOS.Sav",
          filename: "ClientSettingsIOS.Sav",
          hash: crypto
            .createHash("sha1")
            .update(fs.readFileSync(saveDir, "latin1"))
            .digest("hex"),
          hash256: crypto
            .createHash("sha256")
            .update(fs.readFileSync(saveDir, "latin1"))
            .digest("hex"),
          length: Buffer.byteLength(fs.readFileSync(saveDir, "latin1")),
          contentType: "application/octet-stream",
          uploaded: fs.statSync(saveDir).mtime,
          storageType: "S3",
          storageIds: {},
          accountId: req.params.accountId,
          doNotCache: false,
        },
      ]);
    }
  } else {
    res.status(204).end();
  }
});

app.get("/api/cloudstorage/user/:accountId/:file", (req, res) => {
  res.set("Content-Type", "application/octet-stream");

  const { season } = fnVersion(req);
  const saveDir = path.join(
    __dirname,
    `../../ClientSettings/${req.params.accountId}/ClientSettings_S${season}.Sav`
  );

  if (fs.existsSync(saveDir)) {
    return res.send(fs.readFileSync(saveDir));
  } else {
    return res.status(204).end();
  }
});

app.all(
  "/api/cloudstorage/user/:accountId/:file",
  verifyToken,
  rawBody,
  (req, res) => {
    if (req.method != "PUT") {
      return res
        .set(error.method(req, "fortnite").header)
        .status(405)
        .json(error.method(req, "fortnite").error);
    }

    const { season } = fnVersion(req);

    if (Buffer.byteLength(req.rawBody) >= 400000) {
      return res.status(403).json({
        error: "Files over 4kb are not allowed to upload to backend.",
      });
    }

    const saveDir = path.join(
      __dirname,
      `../../ClientSettings/${req.params.accountId}`
    );
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir);
    }

    const file = path.join(saveDir, `ClientSettings_S${season}.Sav`);
    fs.writeFileSync(file, req.rawBody, "latin1");

    res.status(204).end();
  }
);

app.all(
  "/api/game/v2/tryPlayOnPlatform/account/:accountId",
  verifyToken,
  (req, res) => {
    if (req.method != "POST") {
      return res
        .set(error.method(req, "fortnite").header)
        .status(405)
        .json(error.method(req, "fortnite").error);
    }

    res.setHeader("Content-Type", "text/plain").send(true);
  }
);

app.get("/api/game/v2/enabled_features", verifyToken, (req, res) => {
  res.json([]);
});

app.all("/api/storeaccess/v1/request_access/:accountId", (req, res) => {
  if (req.method != "POST") {
    return res
      .set(error.method(req, "fortnite").header)
      .status(405)
      .json(error.method(req, "fortnite").error);
  }

  res.json({});
});

// MCP
app.all(
  "/api/game/v2/profile/:accountId/client/:operation",
  verifyToken,
  async (req, res) => {
    if (req.method != "POST") {
      return res
        .set(error.method(req, "fortnite").header)
        .status(405)
        .json(error.method(req, "fortnite").error);
    }

    const athena = await Athena.findOne({ accountId: req.params.accountId });

    const { season } = fnVersion(req);

    switch (req.params.operation) {
      // set s.a.c
      case "SetAffiliateName": {
        const profile = require(`../../resources/profiles/${
          req.query.profileId || "common_core"
        }.json`);

        if (profile.profileId == "athena") {
          profile.stats.attributes.season_num = season;
        }

        if (
          req.body.affiliateName.toLowerCase() == req.body.affiliateName &&
          profile.profileId == "common_core"
        ) {
          profile.stats.attributes.mtx_affiliate_set_time =
            new Date().toISOString();
          profile.stats.attributes.mtx_affiliate = req.body.affiliateName || "";
          profile.rvn += 1;
          profile.commandRevision += 1;

          try {
            athena.updateOne(
              { accountId: req.params.accountId },
              { currentSAC: req.body.affiliateName }
            );
          } catch {}
        }

        return res.json({
          profileRevision:
            athena.profiles[req.query.profileId || "common_core"].rvn || 1,
          profileId: req.query.profileId || "common_core",
          profileChangesBaseRevision: profile.rvn || 1,
          profileChanges: [
            {
              changeType: "fullProfileUpdate",
              profile: profile,
            },
          ],
          profileCommandRevision: profile.commandRevision || 0,
          serverTime: new Date().toISOString(),
          responseVersion: 1,
        });
      }

      case "EquipBattleRoyaleCustomization": {
        /*
        const profile = require(`../../resources/profiles/${
          req.query.profileId || "athena"
        }.json`);
        const athena = await Athena.findOne({
          accountId: req.params.accountId,
        }).lean();

        const slots = [
          "Backpack",
          "VictoryPose",
          "LoadingScreen",
          "Character",
          "Glider",
          "Dance",
          "CallingCard",
          "ConsumableEmote",
          "MapMarker",
          "Charm",
          "SkyDiveContrail",
          "Hat",
          "PetSkin",
          "ItemWrap",
          "MusicPack",
          "BattleBus",
          "Pickaxe",
          "VehicleDecoration",
        ];

        let slotName = req.body.slotName;

        switch (req.body.slotName) {
          case "ItemWrap": {
            slotName = "itemwraps";
          }
          case "Dance": {
            if (req.body.indexWithinSlot == -1) {
              const x = req.body.slotName == "Dance" ? 6 : 7;
              let list = [];

              let final = ({ locker } = await Athena.findOne({
                accountId: req.params.accountId,
              }).lean());

              for (const y = 0; y < num; y++) {
                list.push(
                  `${req.body.itemToSlot.split(":")[0]}:${req.body.itemToSlot
                    .split(":")[1]
                    .toLowerCase()}`
                );
              }

              console.log(final);

              // save to db.
              await Athena.updateOne(
                {
                  accountId: req.params.accountId,
                },
                {
                  locker: final,
                }
              );
              
            }
          }
          default: {
            return res
              .set(error.operationNotFound(req, "fortnite").header)
              .status(404)
              .json(error.operationNotFound(req, "fortnite").error);
          }
        }
      */

        return res
          .set({
            "X-Epic-Error-Name": `errors.com.epicgames.fortnite.not_supported`,
            "X-Epic-Error-Code": 16035,
          })
          .status(404)
          .json({
            errorCode: `errors.com.epicgames.fortnite.not_supported`,
            errorMessage: `Equiping cosmetics is currently not supported on SwitchMP, but will be supported in the next update.`,
            messageVars: [req.params.operation],
            numericErrorCode: 16035,
            originatingService: "fortnite",
            intent: "prod",
          });
      }

      default: {
        const profile = require(`../../resources/profiles/${
          req.query.profileId || "athena"
        }.json`);

        // set profile values.
        if (profile.profileId == "athena") {
          profile.stats.level = athena.level;
          profile.stats.attributes.season_num = season;
          profile.created = athena.created;
          profile.updated = new Date().toISOString();
          profile.accountId = athena.accountId;
          //profile.items.Currency.quantity = athena.vbucks;
          profile.version = fnVersion(req).version;
        } else if (profile.profileId == "common_core") {
          profile.created = athena.created;
          profile.updated = new Date().toISOString();
          profile.accountId = athena.accountId;
          //profile.items.Currency.quantity = athena.vbucks;
          profile.version = fnVersion(req).version;
        } else if (profile.profileId == "common_public") {
          profile.created = athena.created;
          profile.updated = new Date().toISOString();
          profile.accountId = athena.accountId;
          //profile.items.Currency.quantity = athena.vbucks;
          profile.version = fnVersion(req).version;
        } else if (profile.profileId == "creative") {
          profile.created = athena.created;
          profile.updated = new Date().toISOString();
          profile.accountId = athena.accountId;
          //profile.items.Currency.quantity = athena.vbucks;
          profile.version = fnVersion(req).version;
        }

        return res.json({
          profileRevision:
            athena.profiles[req.query.profileId || "athena"].rvn || 1,
          profileId: req.query.profileId || "athena",
          profileChangesBaseRevision:
            athena.profiles[req.query.profileId || "athena"].rvn || 1,
          profileChanges: [
            {
              changeType: "fullProfileUpdate",
              profile: profile,
            },
          ],
          profileCommandRevision:
            athena.profiles[req.query.profileId || "athena"].cmdRvn || 0,
          serverTime: new Date().toISOString(),
          responseVersion: 1,
        });
      }
    }
  }
);

app.get("/api/feedback/*", verifyToken, (req, res) => {
  res.status(204).end();
});

app.get("/api/storefront/v2/keychain", verifyToken, (req, res) => {
  const keychain = require("../../resources/keychain.json");
  res.json(keychain);
});

app.get("/api/calendar/v1/timeline", (req, res) => {
  const { season } = fnVersion(req);

  let activeEvents = [
    {
      eventType: `EventFlag.Season${season}`,
      activeUntil: "9999-01-01T00:00:00.000Z",
      activeSince: "2020-01-01T00:00:00.000Z",
    },
    {
      eventType: `EventFlag.LobbySeason${season}`,
      activeUntil: "9999-01-01T00:00:00.000Z",
      activeSince: "2020-01-01T00:00:00.000Z",
    },
  ];

  if (
    global.ingameCfg.timeline.events.season_4.crackInSky &&
    fnVersion(req).version == "4.5"
  ) {
    activeEvents.push({
      eventType: "EventFlag.BR_S4_Rift_Growth",
      activeUntil: "9999-01-01T00:00:00.000Z",
      activeSince: "2020-01-01T00:00:00.000Z",
    });
  }
  if (
    global.ingameCfg.timeline.events.season_5.birthdayBus &&
    fnVersion(req).version == "5.10"
  ) {
    activeEvents.push({
      eventType: "EventFlag.BirthdayBattleBus",
      activeUntil: "9999-01-01T00:00:00.000Z",
      activeSince: "2020-01-01T00:00:00.000Z",
    });
  }
  if (
    global.ingameCfg.timeline.events.season_6.halloweenBus &&
    fnVersion(req).version == ["6.20", "6.21"]
  ) {
    activeEvents.push({
      eventType: "",
      activeUntil: "9999-01-01T00:00:00.000Z",
      activeSince: "2020-01-01T00:00:00.000Z",
    });
  }
  if (
    global.ingameCfg.timeline.events.season_6.heist &&
    fnVersion(req).version == "6.21"
  ) {
    activeEvents.push({
      eventType: "EventFlag.LTM_Heist",
      activeUntil: "9999-01-01T00:00:00.000Z",
      activeSince: "2020-01-01T00:00:00.000Z",
    });
  }
  if (
    global.ingameCfg.timeline.events.season_6.lilKevin &&
    fnVersion(req).version == "6.21"
  ) {
    activeEvents.push({
      eventType: "EventFlag.LTM_LilKevin",
      activeUntil: "9999-01-01T00:00:00.000Z",
      activeSince: "2020-01-01T00:00:00.000Z",
    });
  }
  if (
    global.ingameCfg.timeline.events.season_7["14DaysOfFortnite"] &&
    fnVersion(req).version == "7.20"
  ) {
    activeEvents.push({
      eventType: "EventFlag.LTM_14DaysOfFortnite",
      activeUntil: "9999-01-01T00:00:00.000Z",
      activeSince: "2020-01-01T00:00:00.000Z",
    });
  }
  if (
    global.ingameCfg.timeline.events.season_7.festivus &&
    fnVersion(req).version == "7.20"
  ) {
    activeEvents.push({
      eventType: "EventFlag.LTE_Festivus",
      activeUntil: "9999-01-01T00:00:00.000Z",
      activeSince: "2020-01-01T00:00:00.000Z",
    });
  }
  if (
    global.ingameCfg.timeline.events.season_7.frostnite &&
    fnVersion(req).version == "7.20"
  ) {
    activeEvents.push({
      eventType: "EventFlag.Frostnite",
      activeUntil: "9999-01-01T00:00:00.000Z",
      activeSince: "2020-01-01T00:00:00.000Z",
    });
  }
  if (
    global.ingameCfg.timeline.events.season_7.overTime &&
    fnVersion(req).version == "7.20"
  ) {
    activeEvents.push({
      eventType: "EventFlag.LTE_S7_OverTime",
      activeUntil: "9999-01-01T00:00:00.000Z",
      activeSince: "2020-01-01T00:00:00.000Z",
    });
  }
  if (
    global.ingameCfg.timeline.events.season_7.snowMap &&
    fnVersion(req).version == "7.20"
  ) {
    activeEvents.push({
      eventType: "EventFlag.MooneyMap", // incorrect but idk the flag.
      activeUntil: "9999-01-01T00:00:00.000Z",
      activeSince: "2020-01-01T00:00:00.000Z",
    });
  }
  if (
    global.ingameCfg.timeline.events.season_7.winterDeimos &&
    fnVersion(req).version == "7.20"
  ) {
    activeEvents.push({
      eventType: "EventFlag.LTM_WinterDeimos",
      activeUntil: "9999-01-01T00:00:00.000Z",
      activeSince: "2020-01-01T00:00:00.000Z",
    });
  }

  res.json({
    channels: {
      "client-matchmaking": {
        states: [],
        cacheExpire: new Date().addHours(1337),
      },
      "client-events": {
        states: [
          {
            validFrom: "2020-01-01T20:28:47.830Z",
            activeEvents: activeEvents,
            state: {
              activeStorefronts: [],
              eventNamedWeights: {},
              seasonNumber: season,
              seasonTemplateId: `AthenaSeason:athenaseason${season}`,
              matchXpBonusPoints: 0,
              seasonBegin: "1337-12-01T07:30:00Z",
              seasonEnd: "4444-12-01T07:30:00Z",
              seasonDisplayedEnd: "4444-12-01T07:30:00Z",
              weeklyStoreEnd: new Date().addHours(24),
              stwEventStoreEnd: new Date().addHours(168),
              stwWeeklyStoreEnd: new Date().addHours(168),
              sectionStoreEnds: { Featured: new Date().addHours(24) },
              dailyStoreEnd: new Date().addHours(24),
            },
          },
        ],
        cacheExpire: new Date().addHours(1337),
      },
    },
    eventsTimeOffsetHrs: 0,
    cacheIntervalMins: 10,
    currentTime: new Date().toISOString(),
  });
});

app.get("/api/storefront/v2/catalog", (req, res) => {
  const shop = require("../../resources/shop.json");
  res.json(shop);
});

app.get("/api/shared/bulk/offers", (req, res) => {
  const store = require("../../resources/store.json");
  res.json(store);
});

app.get(
  "/api/matchmaking/session/findPlayer/:accountId",
  verifyToken,
  (req, res) => {
    res.status(204).end();
  }
);

app.all(
  "/api/matchmaking/session/:sessionId/join",
  verifyToken,
  async (req, res) => {
    if (req.method != "POST") {
      return res
        .set(error.method(req, "fortnite").header)
        .status(405)
        .json(error.method(req, "fortnite").error);
    }

    let user;
    try {
      user = await User.findOne({
        accountId: tokenToAccountId(
          req.headers["authorization"].replace("bearer ", "")
        ),
      }).lean();

      log.matchmaker(`${user.displayName} is joining a match.`);
    } catch {
      return res
        .set(error.accountId_missing(req, "fortnite").header)
        .status(400)
        .json(error.accountId_missing(req, "fortnite"));
    }

    res.status(204).end();
  }
);

app.get(
  "/api/game/v2/matchmaking/account/:accountId/session/:sessionId",
  verifyToken,
  async (req, res) => {
    try {
      const user = await User.findOne({
        accountId: req.params.accountId,
      }).lean();
      if (user.banned) {
        return res
          .set(error.account_banned(req, "fortnite").header)
          .status(403)
          .json(error.account_banned(req, "fortnite").error);
      } else {
        return res.json({
          accountId: req.params.accountId,
          sessionId: req.params.sessionId,
          key: "none",
        });
      }
    } catch {
      return res
        .set(error.authorization_failed(req, "fortnite").header)
        .status(400)
        .json(error.authorization_failed(req, "fortnite").error);
    }
  }
);

app.get(
  "/api/game/v2/matchmakingservice/ticket/player/:accountId",
  verifyToken,
  async (req, res) => {
    try {
      const user = await User.findOne({
        accountId: tokenToAccountId(
          req.headers["authorization"].replace("bearer ", "")
        ),
      }).lean();

      if (user.banned) {
        return res
          .set(error.account_banned(req, "fortnite").header)
          .status(403)
          .json(error.account_banned(req, "fortnite").error);
      } else if (global.backendCfg.maintenance) {
        return res
          .set(error.playlist_unavaible(req, "fortnite").header)
          .status(403)
          .json(error.playlist_unavaible(req, "fortnite").error);
      } else {
        buildIds[req.params.accountId] = req.query.bucketId.split(":")[0];

        return res.json({
          serviceUrl: "ws://127.0.0.1:7575",
          ticketType: "mms-player",
          payload: crypto.randomBytes(16).toString("hex"),
          signature: crypto.randomBytes(16).toString("hex"),
        });
      }
    } catch {
      return res
        .set(error.authorization_failed(req, "fortnite").header)
        .status(403)
        .json(error.authorization_failed(req, "fortnite").error);
    }
  }
);

app.get(
  "/api/matchmaking/session/:sessionId",
  verifyToken,
  async (req, res) => {
    try {
      const user = await User.findOne({
        accountId: tokenToAccountId(
          req.headers["authorization"].replace("bearer ", "")
        ),
      }).lean();
      if (user.banned) {
        return res
          .set(error.account_banned(req, "fortnite").header)
          .status(403)
          .json(error.account_banned(req, "fortnite").error);
      } else {
        const server = {
          ip: "93.238.239.229",
          port: 7777,
        };
        return res.json({
          id: req.params.sessionId,
          ownerId: uuid.v4().replace(/-/gi, "").toUpperCase(),
          ownerName: "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
          serverName: "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
          serverAddress: server.ip,
          serverPort: server.port,
          maxPublicPlayers: 220,
          openPublicPlayers: 175,
          maxPrivatePlayers: 0,
          openPrivatePlayers: 0,
          attributes: {
            REGION_s: "EU",
            GAMEMODE_s: "FORTATHENA",
            ALLOWBROADCASTING_b: true,
            SUBREGION_s: "DE",
            DCID_s: "FORTNITE-LIVEEUGCEC1C2E30UBRCORE0A-14840880",
            tenant_s: "Fortnite",
            MATCHMAKINGPOOL_s: "Any",
            STORMSHIELDDEFENSETYPE_i: 0,
            HOTFIXVERSION_i: 0,
            PLAYLISTNAME_s: "Playlist_DefaultSolo",
            SESSIONKEY_s: uuid.v4().replace(/-/gi, "").toUpperCase(),
            TENANT_s: "Fortnite",
            BEACONPORT_i: 15009,
          },
          publicPlayers: [],
          privatePlayers: [],
          totalPlayers: 1,
          allowJoinInProgress: false,
          shouldAdvertise: false,
          isDedicated: false,
          usesStats: false,
          allowInvites: false,
          usesPresence: false,
          allowJoinViaPresence: true,
          allowJoinViaPresenceFriendsOnly: false,
          buildUniqueId: buildIds[user.accountId] || 0,
          lastUpdated: new Date().toISOString(),
          started: false,
        });
      }
    } catch {
      return res
        .set(error.authorization_failed(req, "fortnite").header)
        .status(403)
        .json(error.authorization_failed(req, "fortnite").error);
    }
  }
);

app.get(
  "/api/receipts/v1/account/:accountId/receipts",
  verifyToken,
  (req, res) => {
    res.json([]);
  }
);

app.get(
  "/api/game/v2/events/tournamentandhistory/:accountId/:region/:platform",
  (req, res) => {
    res.json({});
  }
);

app.get("/api/game/v2/privacy/account/:accountId", (req, res) => {
  res.json({
    accountId: req.params.accountId,
    optOutOfPublicLeaderboards: false,
  });
});

app.all("/api/game/v2/chat/*", (req, res) => {
  if (req.method != "POST") {
    return res
      .set(error.method(req, "fortnite").header)
      .status(405)
      .json(error.method(req, "fortnite").error);
  }

  res.json({
    GlobalChatRooms: [
      {
        roomName: "fortnite",
      },
    ],
  });
});

app.get(
  "/api/stats/accountId/:accountId/bulk/window/alltime",
  verifyToken,
  (req, res) => {
    res.json({
      startTime: 0,
      endTime: 0,
      stats: {},
      accountId: req.params.accountId,
    });
  }
);

app.get("/api/statsv2/account/:accountId", (req, res) => {
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

app.get(
  "/api/game/v2/leaderboards/cohort/:accountId",
  verifyToken,
  (req, res) => {
    res.json([
      {
        accountId: req.params.accountId,
        endTime: 0,
        startTime: 0,
        stats: {},
      },
    ]);
  }
);

app.get("/api/game/v2/world/info", verifyToken, (req, res) => {
  const world = JSON.stringify(
    require("../../resources/world_info.json")
  ).replace("2017-07-25T23:59:59.999Z", new Date().toISOString());
  res.json(JSON.parse(world));
});

app.get("/api/game/v2/twitch/:accountId", verifyToken, (req, res) => {
  res.status(204).end();
});

app.get("/api/statsv2/leaderboards/:playlist", verifyToken, (req, res) => {
  res.json([]);
});

app.get("/api/game/v2/friendcodes/:accountId/epic", verifyToken, (req, res) => {
  res.json([]);
});

app.all(
  "/api/game/v2/profileToken/verify/:accountId",
  verifyToken,
  (req, res) => {
    if (req.method != "POST") {
      return res
        .set(error.method(req, "fortnite").header)
        .status(405)
        .json(error.method(req, "fortnite").error);
    }

    res.status(204).end();
  }
);

app.get(
  "/api/leaderboards/type/group/stat/:playlist/window/:window",
  verifyToken,
  async (req, res) => {
    const friends = await Friends.findOne({
      accountId: tokenToAccountId(
        req.headers["authorization"].replace("bearer ", "")
      ),
    }).lean();

    res.json({
      entries: [
        {
          accountId: "3ff727defbd444eab168810c6520826d",
          displayName: "PlayerPawnAthena",
          rank: 1,
          value: 36304,
        },
      ],
      statName: req.params.playlist,
      statWindow: req.params.window,
    });
  }
);

app.all("/api/feedback/:type", verifyToken, (req, res) => {
  if (req.method != "POST") {
    return res
      .set(error.method(req, "fortnite").header)
      .status(405)
      .json(error.method(req, "fortnite").error);
  }

  res.status(204).end();
});

app.all(
  "/api/matchmaking/session/matchMakingRequest",
  verifyToken,
  (req, res) => {
    if (req.method != "POST") {
      return res
        .set(error.method(req, "fortnite").header)
        .status(405)
        .json(error.method(req, "fortnite").error);
    }

    res.json([]);
  }
);

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "fortnite").header)
    .status(404)
    .json(error.not_found(req, "fortnite").error);
});

module.exports = app;
