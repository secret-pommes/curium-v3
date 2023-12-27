const axios = require("axios");
const path = require("path");
const fs = require("fs");

const log = require("./log.js");

function fnVersion(req) {
  let buildInfo = {
    version: 1.8,
    season: 1,
  };

  try {
    buildInfo.version = req.headers["user-agent"].split("-")[1].split("-")[0];

    buildInfo.season = req.headers["user-agent"].split("-")[1].split(".")[0];
  } catch {}

  return buildInfo;
}

function clientSystem(req) {
  let osInfo = {
    os: "",
    os_version: "",
  };

  try {
    osInfo.os = req.headers["user-agent"].split(" ")[1].split("/")[0];
  } catch {}

  try {
    osInfo.os = req.headers["user-agent"].split("/")[1].split(".")[0];
  } catch {}
}

function rawBody(req, res, next) {
  if (req.headers["content-length"]) {
    if (Number(req.headers["content-length"]) >= 400000)
      return res
        .status(403)
        .json({ error: "Files over 4kb cant be uploaded to the backend." });
  }

  try {
    req.rawBody = "";
    req.setEncoding("latin1");

    req.on("data", (chunk) => (req.rawBody += chunk));
    req.on("end", () => next());
  } catch {
    res.status(400).json({
      error: "unknown error",
    });
  }
}

function createProfile(req, accountId) {}

function shopRefresh() {
  try {
    axios.get("https://api.nitestats.com/v1/epic/store").then((response) => {
      const data = response.data;
      const json = JSON.stringify(data, null, 2);
      const location = path.join(__dirname, "../../resources/shop.json");
      fs.writeFile(location, json, (error) => {
        if (!error) {
          log.interval("Shop refresh executed.");
        } else {
          log.error(`Error while fetching shop! ${error}`);
        }
      });
    });
  } catch (error) {
    log.error(`Shop Refresh failed!\nError: ${error}`);
  }
}

module.exports = {
  fnVersion,
  clientSystem,
  rawBody,
  createProfile,
  shopRefresh,
};
