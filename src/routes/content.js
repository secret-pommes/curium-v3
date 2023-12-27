const app = require("express").Router();

const content = require("../../resources/content.json");
const error = require("../structs/error.js");

app.get("/api/pages/fortnite-game", (req, res) => {
  let lang = req.headers["accept-language"];
  let season = 13;

  try {
    season = req.headers["user-agent"].split("-")[1].split(".")[0] || 13;

    if (season == "Cert") {
      season = 2;
    } else if (season == "Live") {
      season = 1;
    }
  } catch {
    season = 2;
  }

  let img = {
    left: "https://cdn2.unrealengine.com/Fortnite/fortnite-game/battle-pass-about/Season_8/11BR_Launch_Upsell_WhatsInside-(1)-1024x1024-68356adb3844b46ada633ace2d168af74b446f35.png",
    right:
      "https://cdn2.unrealengine.com/Fortnite/fortnite-game/battle-pass-about/Season_8/11BR_Launch_Upsell_HowDoesItWork-1024x1024-faa688dad8111f0a944c351dd7b11e4bff3562aa.png",
    extra:
      "https://cdn2.unrealengine.com/Fortnite/fortnite-game/battle-pass-about/Season_8/11BR_Launch_Upsell_Badges-1024x1024-94b54a7e241b5747d83095feb1e6fc330c49689f.png",
  };

  if (season == 8) {
    img.left =
      "https://bucket.retrac.site/d3ceba508f24a70c50bd8782d08bd531.png";
    img.right =
      "https://bucket.retrac.site/d3efdf96ccdd3981a2a4813a04594233.png";
  }

  // correct some stuff
  if (lang.includes("-") && lang != "es-419" && lang != "pt-BR") {
    lang = lang.split("-")[0];
  }

  // use english if lang is not supported.
  try {
    let check = content.lang[lang].br.title;
  } catch {
    lang = "en";
  }

  res.json({
    _activeDate: new Date().toISOString(),
    _locale: lang,
    _suggestedPrefetch: "",
    _title: "Fortnite Game",
    battlepassaboutmessages: {
      _activeDate: new Date().toISOString(),
      _locale: lang,
      _noIndex: false,
      _title: "BattlePassAboutMessages",
      lastModified: new Date().toISOString(),
      news: {
        _type: "Battle Royale News",
        messages: [
          {
            _type: "CommonUI Simple Message Base",
            body: "Play to level up your Battle Pass. Earn XP from a variety of in-game activities like searching chests, eliminating opponents, completing challenges, and more! Level up to unlock over 100 rewards including 1500 V-Bucks!. You can purchase the Battle Pass any time during the season for 950 V-Bucks and retroactively unlock any rewards up to your current level.",
            hidden: false,
            Image:
              "https://cdn2.unrealengine.com/Fortnite/fortnite-game/battle-pass-about/Season_8/11BR_Launch_Upsell_HowDoesItWork-1024x1024-faa688dad8111f0a944c351dd7b11e4bff3562aa.png",
            layout: "Right Image",
            spotlight: false,
            title: "HOW DOES IT WORK?",
          },
          {
            _type: "CommonUI Simple Message Base",
            body: "When you buy the Battle Pass, you’ll instantly receive two exclusive outfits - Turk and Journey! You can earn more exclusive rewards including Emotes, Outfits, Wraps, Pickaxes, Loading Screens and more. You’ll receive a reward each time you level up and for the first time, you can keep leveling up beyond level 100!",
            hidden: false,
            Image:
              "https://cdn2.unrealengine.com/Fortnite/fortnite-game/battle-pass-about/Season_8/11BR_Launch_Upsell_WhatsInside-(1)-1024x1024-68356adb3844b46ada633ace2d168af74b446f35.png",
            layout: "Left Image",
            spotlight: false,
            title: "WHAT`S INSIDE?",
          },
          {
            _type: "CommonUI Simple Message Base",
            body: "Battle Pass progression has been entirely reworked this Season. Advance your Battle Pass by completing challenges and earning in-game Medals! Earn daily medals and fill out your punch card to maximize your XP.",
            hidden: false,
            Image:
              "https://cdn2.unrealengine.com/Fortnite/fortnite-game/battle-pass-about/Season_8/11BR_Launch_Upsell_Badges-1024x1024-94b54a7e241b5747d83095feb1e6fc330c49689f.png",
            spotlight: false,
            title: "",
          },
        ],
      },
    },
    emergencynotice: {
      _activeDate: new Date().toISOString(),
      _locale: lang,
      _noIndex: false,
      _title: "emergencynotice",
      alwaysShow: true,
      lastModified: new Date().toISOString(),
      news: {
        _type: "Battle Royale News",
        messages: [
          {
            _type: "CommonUI Simple Message Base",
            body: global.ingameCfg.lobby_message.body,
            hidden: false,
            spotlight: true,
            title: global.ingameCfg.lobby_message.title,
          },
        ],
      },
    },
    emergencynoticev2: {
      _activeDate: new Date().toISOString(),
      _locale: lang,
      _noIndex: false,
      _title: "emergencynoticev2",
      emergencynotices: {
        _type: "Emergency Notices",
        emergencynotices: [
          {
            _type: "CommonUI Simple Message Base",
            body: global.ingameCfg.lobby_message.body,
            gamemodes: "",
            hidden: false,
            title: global.ingameCfg.lobby_message.title,
          },
        ],
      },
      "jcr:baseVersion": "a7ca237317f1e771e921e2-7f15-4485-b2e2-553b809fa363",
      "jcr:isCheckedOut": true,
      lastModified: new Date().toISOString(),
    },
    battleroyalenews: {
      news: {
        motds: [],
        _type: "Battle Royale News",
        messages: [
          {
            image: "http://127.0.0.1:7474/assets/img/backgroundS7.jpg",
            hidden: false,
            messagetype: "normal",
            _type: "CommonUI Simple Message Base",
            adspace: "V3!",
            title: "Curium V3!",
            body: "Source: https://github.com/secret-pommes/curium-v3",
            spotlight: false,
          },
        ],
      },
      _title: "battleroyalenews",
      header: "",
      style: "None",
      _noIndex: false,
      alwaysShow: false,
      _activeDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      _locale: lang,
      _templateName: "FortniteGameMOTD",
    }, // translate
    subgameselectdata: {
      saveTheWorldUnowned: {
        _type: "CommonUI Simple Message",
        message: {
          _type: "CommonUI Simple Message",
          image: "",
          hidden: false,
          messagetype: "normal",
          _type: "CommonUI Simple Message Base",
          title: content.lang[lang].stw.title,
          body: content.lang[lang].stw.body,
          spotlight: false,
        },
      }, // translate
      battleRoyale: {
        _type: "CommonUI Simple Message",
        message: {
          image: "",
          hidden: false,
          messagetype: "normal",
          _type: "CommonUI Simple Message Base",
          title: content.lang[lang].br.title,
          body: content.lang[lang].br.body,
          spotlight: false,
        },
      }, // translate
      creative: {
        _type: "CommonUI Simple Message",
        message: {
          image: "",
          hidden: false,
          messagetype: "normal",
          _type: "CommonUI Simple Message Base",
          title: content.lang[lang].creative.title,
          body: content.lang[lang].creative.body,
          spotlight: false,
        },
      }, // translate
      saveTheWorld: {
        _type: "CommonUI Simple Message",
        message: {
          image: "",
          hidden: false,
          messagetype: "normal",
          _type: "CommonUI Simple Message Base",
          title: content.lang[lang].stw.title,
          body: content.lang[lang].stw.body,
          spotlight: false,
        },
      },
    },
    // translate
    athenamessage: {
      _title: "athenamessage",
      overrideablemessage: {
        _type: "CommonUI Simple Message",
        message: {
          _type: "CommonUI Simple Message Base",
          title: "Curium V3!",
          body: "1.7.2 is not official supported!",
        },
      },
      _activeDate: "2017-08-30T03:08:31.687Z",
      lastModified: "2017-09-26T16:20:19.615Z",
      _locale: lang,
      _templateName: "FortniteGameMOTD",
    },
    _suggestedPrefetch: [],
  });
});

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "content").header)
    .status(404)
    .json(error.not_found(req, "content").error);
});

module.exports = app;
