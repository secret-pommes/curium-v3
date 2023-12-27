const { MessageEmbed } = require("discord.js");

const User = require("../../model/user.js");

module.exports = {
  cmdInfo: {
    name: "ban",
    description: "Ban a user by username",
    options: [
      {
        name: "username",
        description: "username of the user that you want to ban.",
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
              value: "You dont have the permission to ban users.",
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

      if (user.banned) {
        return x.editReply({
          embeds: [
            new MessageEmbed()
              .setColor("DARK_BUT_NOT_BLACK")
              .setFields({
                name: "⚠ Error",
                value: `${user.displayName} is already banned.`,
              })
              .setTimestamp(),
          ],
          ephemeral: true,
        });
      } else {
        await User.findOneAndUpdate(
          { displayName: x.options.get("username").value },
          { banned: true }
        );

        return x.editReply({
          embeds: [
            new MessageEmbed()
              .setColor("DARK_BUT_NOT_BLACK")
              .setFields({
                name: "✔ Success",
                value: `You successfully ${user.displayName} banned.`,
              })
              .setTimestamp(),
          ],
          ephemeral: true,
        });
      }
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
