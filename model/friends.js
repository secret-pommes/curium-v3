const mongo = require("mongoose");

const Friends = new mongo.Schema(
  {
    accountId: { type: String, required: true },
    friendList: {
      type: Object,
      default: { accepted: [], incoming: [], outgoing: [], blocked: [] },
    },
  },
  {
    collation: "Friends",
  }
);

module.exports = mongo.model("Friends", Friends);
