const { MessageEmbed } = require("discord.js");

const User = require("../../model/user.js");

module.exports = {
  cmdInfo: {
    name: "lookup",
    description: "lookup a user by his username.",
    options: [
      {
        name: "username",
        description: "username of the user that you want to lookup.",
        required: true,
        type: 3,
      },
    ],
  },

  execute: async (x) => {
    await x.deferReply({ ephemeral: true });

    if (!global.discordCfg.bot.mods.includes(x.user.id)) {
      return x.editReply({
        embeds: [
          new MessageEmbed()
            .setColor("DARK_BUT_NOT_BLACK")
            .setFields({
              name: "⚠ Error",
              value: "You dont have the permission to lookup users.",
            })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
    }

    try {
      const user = await User.findOne({
        displayName: x.options.get("username").value,
      }).lean();

      return x.editReply({
        embeds: [
          new MessageEmbed()
            .setColor("DARK_BUT_NOT_BLACK")
            .setFields(
              { name: "Account-Id", value: user.accountId },
              { name: "Discord-Id", value: user.discordId },
              { name: "Username", value: user.displayName },
              { name: "Created-At", value: `${new Date()}`.substring(0, 15) },
              { name: "Banned", value: user.banned ? "Yes" : "No" }
            )
            .setTimestamp(),
        ],
        ephemeral: true,
      });
    } catch {
      return x.editReply({
        embeds: [
          new MessageEmbed()
            .setColor("DARK_BUT_NOT_BLACK")
            .setFields({
              name: "⚠ Error",
              value: `${x.options.get("username").value} was not found.`,
            })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
    }
  },
};
