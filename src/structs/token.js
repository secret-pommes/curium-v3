const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const log = require("./log.js");
const User = require("../../model/user.js");
const error = require("../structs/error.js");

let tokens = {};

try {
  tokens = fs
    .readFileSync(path.join(__dirname, "tokens/tokens.json"))
    .toString();
} catch {
  log.error("Token file does not exists!");
}

const tokenData = JSON.parse(tokens);

// create & delete
function createToken(accountId) {
  const token = crypto.randomBytes(25).toString("hex");

  while (Object.values(tokenData).includes(token)) {
    token = crypto.randomBytes(25).toString("hex");
  }

  tokenData[accountId] = token;
  fs.writeFileSync(
    path.join(__dirname, "tokens/tokens.json"),
    JSON.stringify(tokenData, null, 2),
    "utf8"
  );
  return token;
}
function deleteToken(accountId, token) {
  if (tokenData.hasOwnProperty(accountId) && tokenData[accountId] === token) {
    delete tokenData[accountId];

    fs.writeFileSync(
      path.join(__dirname, "tokens/tokens.json"),
      JSON.stringify(tokenData, null, 2),
      "utf8"
    );
  } else {
    log.error(`Could not delete token for ${accountId}`);
  }
  return "deleted";
}

// verify token
async function verifyToken(req, res, next) {
  let token;
  let accountId;

  try {
    token = req.headers["authorization"].replace("bearer ", "");
    accountId = tokenToAccountId(token);
  } catch {
    return res
      .set(error.authorization_failed(req).header)
      .status(401)
      .json(error.authorization_failed(req).header);
  }

  if ((await tokenData[accountId]) == token) {
    return next();
  } else {
    return res
      .set(error.authorization_failed(req).header)
      .status(401)
      .json(error.authorization_failed(req).header);
  }
}

// check if user is still existing in db and if not delete his token. (needs fixes)
async function verifyAccountToken() {
  const accountIdsToCheck = Object.keys(tokenData);
  const existingAccountIds = await User.find({
    accountId: { $in: accountIdsToCheck },
  });
  const foundAccountIds = existingAccountIds.map((user) => user.accountId);

  for (const accountId in tokenData) {
    if (!foundAccountIds.includes(accountId)) {
      delete tokenData[accountId];
    }
  }

  fs.writeFileSync(
    path.join(__dirname, "tokens/tokens.json"),
    JSON.stringify(tokenData, null, 2),
    "utf8"
  );
  log.interval("Token check executed.");
  return foundAccountIds;
}

// get users token or accountId
function tokenToAccountId(token) {
  for (const accountId in tokenData) {
    if (tokenData.hasOwnProperty(accountId) && tokenData[accountId] === token) {
      return accountId;
    }
  }
}
function AccountIdToToken(accountId) {
  if (tokenData.hasOwnProperty(accountId)) {
    return tokenData[accountId];
  } else {
    return null;
  }
}

module.exports = {
  createToken,
  deleteToken,
  verifyToken,
  verifyAccountToken,
  tokenToAccountId,
  AccountIdToToken,
};
