const crypto = require("crypto");

const Athena = require("../../model/athena.js");
const Friends = require("../../model/friends.js");
const User = require("../../model/user.js");

// create
async function createAccountId() {
  while (true) {
    const accountId = crypto.randomBytes(16).toString("hex");
    const accountIdExists = await checkAccountId(accountId);
    if (accountIdExists == "NOT_FOUND") {
      return accountId;
    }
  }
}

async function createPasscode() {
  let code = "";
  while (true) {
    for (let i = 0; i < 15; i++) {
      code += Math.floor(Math.random() * 10);
    }
    const passwordExists = await checkPasscode(code);
    if (passwordExists == "NOT_FOUND") {
      return code;
    }
  }
}

// checks
async function checkDiscordId(discordId) {
  const existingUser = await User.findOne({
    $or: [{ discordId: discordId }],
  });
  if (existingUser) {
    return "FOUND";
  } else {
    return "NOT_FOUND";
  }
}

async function checkEmail(email) {
  const existingUser = await User.findOne({
    $or: [{ email: email }],
  });
  if (existingUser) {
    return "FOUND";
  } else {
    return "NOT_FOUND";
  }
}

async function checkPasscode(passcode) {
  const check = await User.findOne({ passcode: passcode });
  if (check) {
    return "FOUND";
  } else {
    return "NOT_FOUND";
  }
}

async function checkDisplayName(displayName) {
  const existingUser = await User.findOne({
    $or: [{ displayName: displayName }],
  });
  if (existingUser) {
    return "FOUND";
  } else {
    return "NOT_FOUND";
  }
}

async function checkAccountId(accountId) {
  const existingUser1 = await User.findOne({
    $or: [{ accountId: accountId }],
  });
  const existingUser2 = await Athena.findOne({
    $or: [{ accountId: accountId }],
  });
  const existingUser3 = await Friends.findOne({
    $or: [{ accountId: accountId }],
  });
  if ((existingUser1, existingUser2, existingUser3)) {
    return "FOUND";
  } else {
    return "NOT_FOUND";
  }
}

module.exports = {
  createAccountId,
  checkDiscordId,
  checkEmail,
  createPasscode,
  checkDisplayName,
};
