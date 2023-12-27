const fs = require("fs");
const path = require("path");
const clic = require("cli-color");

const { version } = require("../../package.json");
const ascii = fs.readFileSync(path.join(__dirname, "../../resources/ascii.txt"), "utf-8");
console.log(
  clic.cyan(`\n\n${ascii}\n\n${clic.bold(`${version} by: not_secret1337`)}\n\n`)
);
