const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  cmdInfo: {
    name: "maintenance",
    description: "turn on or off the maintenance mode of the backend.",
    options: [
      {
        name: "confirm",
        description: "turn on or off the maintenance mode of the backend.",
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
              value:
                "You dont have the permission to turn or off the maintenance mode.",
            })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
    }

    if (x.options.get("confirm").value == "true") {
      try {
        fs.readFile(
          path.join(__dirname, "../../config/server_config.json"),
          "utf-8",
          (err, data) => {
            if (err) {
              return x.editReply({
                embeds: [
                  new MessageEmbed()
                    .setColor("DARK_BUT_NOT_BLACK")
                    .setFields({
                      name: "⚠ Error",
                      value: "Could not turn on or off the maintenance mode.",
                    })
                    .setTimestamp(),
                ],
                ephemeral: true,
              });
            }

            try {
              const json = JSON.parse(data);
              if (json.maintenance) {
                json.maintenance = false;
              } else {
                json.maintenance = true;
              }

              fs.writeFile(
                path.join(__dirname, "../../config/server_config.json"),
                JSON.stringify(json, null, 2),
                (err) => {
                  if (err) {
                    return x.editReply({
                      embeds: [
                        new MessageEmbed()
                          .setColor("DARK_BUT_NOT_BLACK")
                          .setFields({
                            name: "⚠ Error",
                            value:
                              "Could not turn on or off the maintenance mode.",
                          })
                          .setTimestamp(),
                      ],
                      ephemeral: true,
                    });
                  } else {
                    if (json.maintenance) {
                      return x.editReply({
                        embeds: [
                          new MessageEmbed()
                            .setColor("DARK_BUT_NOT_BLACK")
                            .setFields({
                              name: "✔ Success",
                              value:
                                "You Successfully turned on the maintenance mode.",
                            })
                            .setTimestamp(),
                        ],
                        ephemeral: true,
                      });
                    } else {
                      return x.editReply({
                        embeds: [
                          new MessageEmbed()
                            .setColor("DARK_BUT_NOT_BLACK")
                            .setFields({
                              name: "✔ Success",
                              value:
                                "You Successfully turned off the maintenance mode.",
                            })
                            .setTimestamp(),
                        ],
                        ephemeral: true,
                      });
                    }
                  }
                }
              );
            } catch (err) {
              console.log(err);
              return x.editReply({
                embeds: [
                  new MessageEmbed()
                    .setColor("DARK_BUT_NOT_BLACK")
                    .setFields({
                      name: "⚠ Error",
                      value: "Could not turn on or off the maintenance mode.",
                    })
                    .setTimestamp(),
                ],
                ephemeral: true,
              });
            }
          }
        );
      } catch (err) {
        console.log(err);
        return x.editReply({
          embeds: [
            new MessageEmbed()
              .setColor("DARK_BUT_NOT_BLACK")
              .setFields({
                name: "⚠ Error",
                value: "Could not turn on or off the maintenance mode.",
              })
              .setTimestamp(),
          ],
          ephemeral: true,
        });
      }
    } else {
      return x.editReply({
        embeds: [
          new MessageEmbed()
            .setColor("DARK_BUT_NOT_BLACK")
            .setFields({
              name: "⚠ Error",
              value:
                "Could not turn on or off the maintenance mode. Make sure to confirm with true.",
            })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
    }
  },
};
