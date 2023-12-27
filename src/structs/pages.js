const app = require("express").Router();
const path = require("path");
const fs = require("fs");

const error = require("../structs/error.js");

app.get("/", (req, res) => {
  const localtion = path.join(__dirname, "../../public/register.html");

  if (fs.existsSync(localtion)) {
    res.sendFile(localtion);
  } else {
    return res
      .set(error.server_error(req, "pages").header)
      .status(500)
      .json(error.server_error(req, "pages").error);
  }
});

app.get("/createdAccount", (req, res) => {
  const localtion = path.join(__dirname, "../../public/createdAccount.html");

  if (fs.existsSync(localtion)) {
    res.sendFile(localtion);
  } else {
    return res
      .set(error.server_error(req, "pages").header)
      .status(500)
      .json(error.server_error(req, "pages").error);
  }
});

app.get("/login", (req, res) => {
  const localtion = path.join(__dirname, "../../public/login.html");

  if (fs.existsSync(localtion)) {
    res.sendFile(localtion);
  } else {
    return res
      .set(error.server_error(req, "pages").header)
      .status(500)
      .json(error.server_error(req, "pages").error);
  }
});

app.get("/error_1", (req, res) => {
  const localtion = path.join(__dirname, "../../public/error_1.html");

  if (fs.existsSync(localtion)) {
    res.sendFile(localtion);
  } else {
    return res
      .set(error.server_error(req, "pages").header)
      .status(500)
      .json(error.server_error(req, "pages").error);
  }
});

app.get("/vbucksnotice", (req, res) => {
  const localtion = path.join(__dirname, "../../public/vbucksnotice.html");

  if (fs.existsSync(localtion)) {
    res.sendFile(localtion);
  } else {
    return res
      .set(error.server_error(req, "pages").header)
      .status(500)
      .json(error.server_error(req, "pages").error);
  }
});

module.exports = app;
