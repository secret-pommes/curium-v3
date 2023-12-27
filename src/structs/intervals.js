const { shopRefresh } = require("./structures.js");
const { verifyAccountToken } = require("./token.js");

// Run function at start of the backend.
shopRefresh();
verifyAccountToken();

// Internal: Item-Shop
setInterval(() => {
  shopRefresh, global.ingameCfg.shop.ItemShop.fetchInterval;
}, 60 * 60 * 1000);

// Internal: Token Management.
setInterval(() => {
  verifyAccountToken;
}, 12 * 60 * 60 * 1000);
