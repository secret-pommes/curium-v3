const mongo = require("mongoose");

const User = new mongo.Schema(
  {
    createdAt: { type: Date, default: new Date() },
    accountId: { type: String, required: true },
    discordId: { type: String, required: true},
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    passcode: { type: String, required: true },
    banned: { type: Boolean, default: false },
  },
  {
    collation: "Users",
  }
);

module.exports = mongo.model("User", User);
