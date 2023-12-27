const mongo = require("mongoose");

const Athena = new mongo.Schema(
  {
    accountId: { type: String, required: true },
    created: { type: String, default: new Date().toISOString() },
    level: { type: Number, default: 1 },
    vbucks: { type: Number, default: 0 },
    country: { type: String, default: "" },
    matchmakingRegion: { type: String, default: "EU" },
    currentSAC: { type: String, default: "" },
    banner: {
      type: Object,
      default: { banner: "StandardBanner1", bannerColor: "DefaultColor1" },
    },
    locker: {
      type: Object,
      default: {
        character: "",
        characterVariants: "",
        backpack: "",
        backpackVariants: "",
        pickaxe: "",
        pickaxeVariants: "",
        glider: "",
        gliderVaraints: "",
        contrail: "",
        dances: ["", "", "", "", "", ""],
        itemwrap: ["", "", "", "", "", "", ""],
        music: "",
        loadingscreen: "",
      },
    },
    profiles: {
      type: Object,
      default: {
        athena: { rvn: 1, cmdRvn: 1 },
        campaign: { rvn: 1, cmdRvn: 1 },
        collection_book_people0: { rvn: 1, cmdRvn: 1 },
        collection_book_schematics0: { rvn: 1, cmdRvn: 1 },
        collections: { rvn: 1, cmdRvn: 1 },
        common_core: { rvn: 1, cmdRvn: 1 },
        common_public: { rvn: 1, cmdRvn: 1 },
        creative: { rvn: 1, cmdRvn: 1 },
        metadata: { rvn: 1, cmdRvn: 1 },
        outpost0: { rvn: 1, cmdRvn: 1 },
        profile0: { rvn: 1, cmdRvn: 1 },
        theater0: { rvn: 1, cmdRvn: 1 },
      },
    },
    ownedAthena: {
      type: Object,
      default: {},
    },
  },
  {
    collation: "Athena",
  }
);

module.exports = mongo.model("Athena", Athena);
