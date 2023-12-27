const clic = require("cli-color");

function backend(data) {
  console.log(clic.green(`[Backend] ${data}`));
}

function discord(data) {
  console.log(clic.blue(`[Discord] ${data}`));
}

function interval(data) {
  console.log(clic.blue(`[Interval] ${data}`));
}

function matchmaker(data) {
  console.log(clic.blue(`[Matchmaker] ${data}`));
}

function user(data) {
  console.log(clic.blue(`[User] ${data}`));
}

function xmpp(data) {
  console.log(clic.blue(`[XMPP] ${data}`));
}

function warning(data) {
  console.log(clic.yellow(`[Warning] ${data}`));
}

function error(data) {
  console.log(clic.red(`[Error] ${data}`));
}

module.exports = {
  backend,
  discord,
  interval,
  matchmaker,
  user,
  xmpp,
  warning,
  error,
};
