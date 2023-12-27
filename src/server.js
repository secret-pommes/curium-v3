const app = require("express")();
const bodyparser = require("body-parser");
const mongo = require("mongoose");

const log = require("./structs/log.js");
const error = require("./structs/error.js");

// Init Config & Ascii boot logo
require("./structs/ascii.js");
require("./structs/globals.js");

app
  .listen(global.backendCfg.backend_port, () => {
    log.backend(`Started listening on port ${global.backendCfg.backend_port}`);

    require("../discord/discord-bot.js");
    require("./structs/xmpp.js");
    require("./structs/globals.js");

    if (!global.backendCfg.dev.disable_intervals)
      require("./structs/intervals.js");
  })
  .on("error", () => {
    log.error("Failed to start listening!\nClosing backend in 3 seconds..");
    setTimeout(() => {
      process.exit(0);
    }, 3000);
  });

mongo.set("useNewUrlParser", true);
mongo.set("useUnifiedTopology", true);

if (global.backendCfg.db.host) {
  mongo.connect(global.backendCfg.db.host, () => {
    log.backend("Successfully connected to database!");
  });
} else {
  log.warning(
    "Database got disabled over the config, Backend will not connect to database!"
  );
}

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.set({
    "X-Server-Time": new Date().toISOString(),
    "X-Powered-By": "SecretsServer",
  });
  next();
});

app.get("/restart", (req, res) => {
  if (global.backendCfg.dev.allow_restart_route) {
    log.backend("Restarting..");
    res.json({ server: "Server is restarting.." });
    process.exit(0);
  } else {
    return res.json({ server: "The restart route is disabled." });
  }
});

app.use("/account", require("./routes/account.js"));
app.use("/affiliate", require("./routes/affiliate.js"));
app.use("/api", require("./routes/api.js"));
app.use("/assets", require("./routes/assets.js"));
app.use("/auth", require("./routes/auth.js"));
app.use("/catalog", require("./routes/catalog.js"));
app.use("/content-controls", require("./routes/content-controls.js"));
app.use("/content", require("./routes/content.js"));
app.use("/datarouter", require("./routes/datarouter.js"));
app.use("/dedicated-server", require("./routes/dedicated-server.js"));
app.use("/eulatracking", require("./routes/eulatracking.js"));
app.use("/fortnite", require("./routes/fortnite.js"));
app.use("/friends", require("./routes/friends.js"));
app.use("/launcher", require("./routes/launcher.js"));
app.use("/lightswitch", require("./routes/lightswitch.js"));
app.use("/party", require("./routes/party.js"));
app.use("/presence", require("./routes/presence.js"));
app.use("/priceengine", require("./routes/priceengine.js"));
app.use("/purchase", require("./routes/purchase.js"));
app.use("/socialban", require("./routes/socialban.js"));
app.use("/statsproxy", require("./routes/statsproxy.js"));
app.use("/tinfoil", require("./routes/tinfoil.js"));
app.use("/waitingroom", require("./routes/waitingroom.js"));
app.use(require("express-status-monitor")());
app.use(require("./structs/pages.js"));

app.use((req, res, next) => {
  res
    .set(error.not_found(req).header)
    .status(404)
    .json(error.not_found(req).error);
});
