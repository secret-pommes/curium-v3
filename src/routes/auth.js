const app = require("express").Router();
const axios = require("axios");

const error = require("../structs/error.js");
const log = require("../structs/log.js");
const register = require("../structs/register.js");
const Athena = require("../../model/athena.js");
const Friends = require("../../model/friends.js");
const User = require("../../model/user.js");

app.get("/api/discord_auth", (req, res) => {
  res.redirect(global.discordCfg.discord_application_url);
});

app.get("/api/discord_callback", async (req, res) => {
  if (!req.query.code) {
    return res.status(400).json({ error: "No code found." });
  }
  const { code } = req.query;

  try {
    const response = await axios.post(
      "https://discord.com/api/v10/oauth2/token",
      {
        client_id: global.discordCfg.discord_client_id,
        client_secret: global.discordCfg.discord_client_secret,
        grant_type: "authorization_code",
        code: code.toString(),
        redirect_uri: global.discordCfg.discord_redirect_url,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    try {
      const userResponse = await axios.get(
        "https://discord.com/api/users/@me",
        {
          headers: {
            Authorization: `Bearer ${response.data.access_token}`,
          },
        }
      );

      try {
        const { id, username, email } = userResponse.data;
        if (id && username && email) {
          const accountId = await register.createAccountId();
          const passcode = await register.createPasscode();

          if ((await register.checkDiscordId(id)) === "NOT_FOUND") {
            if ((await register.checkDisplayName(username)) === "NOT_FOUND") {
              if ((await register.checkEmail(email)) === "NOT_FOUND") {
                if (accountId && passcode) {
                  let athena = new Athena({ accountId: accountId });
                  let friends = new Friends({ accountId: accountId });
                  let user = new User({
                    accountId: accountId,
                    discordId: id,
                    displayName: username,
                    email: email,
                    passcode: passcode,
                  });

                  athena.save();
                  friends.save();
                  user.save();

                  log.user(`${username} successfully created an account.`);
                  res.redirect("/createdAccount");
                } else {
                  return res
                    .set(
                      error.custom(
                        req,
                        "auth",
                        "to_long_for_passcode_check",
                        1012,
                        "Server took to long to create an passcode for client.",
                        "auth"
                      ).header
                    )
                    .status(500)
                    .json(
                      error.custom(
                        req,
                        "auth",
                        "to_long_for_passcode_check",
                        1012,
                        "Server took to long to create an passcode for client.",
                        "auth"
                      ).error
                    );
                }
              } else {
                return res
                  .set(
                    error.custom(
                      req,
                      "auth",
                      "email_already_taken",
                      12007,
                      "This email has already been taken.",
                      "auth"
                    ).header
                  )
                  .status(400)
                  .json(
                    error.custom(
                      req,
                      "auth",
                      "email_already_taken",
                      12007,
                      "This email has already been taken.",
                      "auth"
                    ).error
                  );
              }
            } else {
              return res
                .set(
                  error.custom(
                    req,
                    "auth",
                    "username_already_taken",
                    12007,
                    "This username has already been taken.",
                    "auth"
                  ).header
                )
                .status(400)
                .json(
                  error.custom(
                    req,
                    "auth",
                    "username_already_taken",
                    12007,
                    "This username has already been taken.",
                    "auth"
                  ).error
                );
            }
          } else {
            return res.redirect("/error_1");
          }
        }
      } catch (error) {
        return res
          .set(
            error.custom(
              req,
              "auth",
              "unknown_error",
              1012,
              "If this keeps up please report this issue at: dsc.gg/switchfnmodding",
              "auth"
            ).header
          )
          .status(500)
          .json(
            error.custom(
              req,
              "auth",
              "unknown_error",
              1012,
              "If this keeps up please report this issue at: dsc.gg/switchfnmodding",
              "auth"
            ).error
          );
      }
    } catch (error) {
      return res
        .set(
          error.custom(
            req,
            "auth",
            "unknown_error",
            1012,
            "If this keeps up please report this issue at: dsc.gg/switchfnmodding",
            "auth"
          ).header
        )
        .status(500)
        .json(
          error.custom(
            req,
            "auth",
            "unknown_error",
            1012,
            "If this keeps up please report this issue at: dsc.gg/switchfnmodding",
            "auth"
          ).error
        );
    }
  } catch {
    return res.status(400).json({ error: "Code expired" });
  }
});

app.all("/api/getuserdata", async (req, res) => {
  if (req.method != "POST") {
    return res
      .set(error.method(req, "auth").header)
      .status(405)
      .json(error.method(req, "auth").error);
  }

  try {
    const user = await User.findOne({
      discordId: req.body.discordId,
      email: req.body.email,
      displayName: req.body.username,
    }).lean();

    if (user) {
      const athena = await Athena.findOne({ accountId: user.accountId });

      const response = {
        account: {
          accountId: user.accountId,
          email: user.email,
          passcode: user.passcode,
          displayName: user.displayName,
        },
        athena: { level: athena.level },
      };

      return res.json(response);
    } else {
      return res
        .set(
          error.custom(
            req,
            "auth",
            "user_not_found",
            110016,
            "Sorry, but this user is not registered.",
            "auth"
          ).header
        )
        .status(404)
        .json(
          error.custom(
            req,
            "auth",
            "user_not_found",
            110016,
            "Sorry, but this user is not registered.",
            "auth"
          ).error
        );
    }
  } catch (error) {
    return res
      .set(
        error.custom(
          req,
          "auth",
          "user_not_found",
          110016,
          "Sorry, but this user is not registered.",
          "auth"
        ).header
      )
      .status(404)
      .json(
        error.custom(
          req,
          "auth",
          "user_not_found",
          110016,
          "Sorry, but this user is not registered.",
          "auth"
        ).error
      );
  }
});

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "auth").header)
    .status(404)
    .json(error.not_found(req, "auth").error);
});

module.exports = app;
