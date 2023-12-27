const { MessageEmbed } = require("discord.js");
const osu = require("os-utils");
const os = require("os");

const { version } = require("../../package.json");

module.exports = {
  cmdInfo: {
    name: "stats",
    description: "See backend stats like CPU usage and more.",
  },

  execute: async (x) => {
    await x.deferReply({ ephemeral: true });

    let uptime = Math.floor(process.uptime() / 60);
    let platform = os.platform();

    if (JSON.stringify(uptime).includes("0")) {
      uptime = `${JSON.stringify(process.uptime()).split(".")[0]} Sec`;
    } else {
      uptime = `${Math.floor(process.uptime() / 60)} Min`;
    }

    if (global.backendCfg.overwrite_os.active) {
      platform = global.backendCfg.overwrite_os.os;
    } else if (platform == "darwin") {
      platform = `MacOS ${os.release()}`;
    } else if (platform == "win32") {
      platform = `Windows ${os.release().split(".")[0]}`;
    } else {
      platform = os.platform();
    }

    let msg = new MessageEmbed()
      .setColor("DARK_BUT_NOT_BLACK")
      .setFields(
        { name: "Status", value: "Online" },
        { name: "Version", value: version },
        { name: "Uptime", value: uptime },
        {
          name: "Memory Usage",
          value: `${((process.memoryUsage().rss / os.totalmem()) * 100).toFixed(
            2
          )}%`,
        },
        { name: "OS", value: platform },
        { name: "CPU Usage", value: `${osu.cpuCount()}%` }
      )
      .setTimestamp();
    return x.editReply({ embeds: [msg], ephemeral: true });
  },
};
