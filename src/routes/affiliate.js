const app = require("express").Router();

const error = require("../structs/error.js");

app.get("/api/public/affiliates/slug/:slug", (req, res) => {
  let found = false;
  const allowedSlugs = [
    "secret1337",
    "yoshicrystal",
    "cron",
    "silver",
    "lintu",
    "nintendosss",
  ];

  allowedSlugs.forEach((slug) => {
    if (req.params.slug.toLowerCase() == slug) {
      found = true;
      return res.json({
        id: req.params.slug,
        slug: slug,
        displayName: req.params.slug,
        status: "ACTIVE",
        verified: false,
      });
    }
  });

  if (!found) {
    res
      .set(error.not_found(req, "affiliate").header)
      .status(404)
      .json(error.not_found(req, "affiliate").error);
  }
});

app.use((req, res, next) => {
  res
    .set(error.not_found(req, "affiliate").header)
    .status(404)
    .json(error.not_found(req, "affiliate").error);
});

module.exports = app;
