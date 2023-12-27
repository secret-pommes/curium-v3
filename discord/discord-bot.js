const { Client, Intents } = require("discord.js");
const fs = require("fs");
const path = require("path");

const log = require("../src/structs/log.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
  log.discord("Bot is connected!");

  client.application.commands.create(require("./cmds/ban.js").cmdInfo);
  client.application.commands.create(require("./cmds/lookup.js").cmdInfo);
  client.application.commands.create(require("./cmds/maintenance.js").cmdInfo);
  client.application.commands.create(require("./cmds/stats.js").cmdInfo);
  client.application.commands.create(require("./cmds/unban.js").cmdInfo);

  setInterval(() => {
    let status = `${JSON.stringify(global.clientCfg.xmppClients).length} players online!`;

    if (JSON.stringify(global.clientCfg.xmppClients).length == 1) {
      status = `${
        JSON.stringify(global.clientCfg.xmppClients).length
      } player online!`;
    }

    client.user.setActivity({
      name: status,
      type: "WATCHING",
    });
  }, 5000);
});

client.on("interactionCreate", (x) => {
  if (!x.isApplicationCommand()) {
    return;
  }
  try {
    if (!x.isApplicationCommand()) {
      return;
    }
    if (fs.existsSync(path.join(__dirname, `./cmds/${x.commandName}.js`))) {
      require(`./cmds/${x.commandName}.js`).execute(x);
    }
  } catch {
    return;
  }
});

client.login(global.discordCfg.bot.token);
