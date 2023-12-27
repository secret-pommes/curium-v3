let stateChanged = false;
let email;
let passcode;

window.onload = async () => {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const [access_token, token_type] = [
    fragment.get("access_token"),
    fragment.get("token_type"),
  ];

  if (!access_token) {
    return (document.getElementById("informationcontainer").style.display =
      "none");
  }

  fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: `${token_type} ${access_token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const userAccount = {
        discordId: data.id,
        email: data.email,
        username: data.username,
      };

      fetch("/auth/api/getuserdata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userAccount),
      })
        .then((response) => response.json())
        .then((data) => {
          if (
            data.account.accountId &&
            data.account.email &&
            data.account.passcode &&
            data.athena.level
          ) {
            document.title = "SwitchMP | Account";
            document.getElementById("sitetitle").innerHTML = "Account";
            document.getElementById("title").innerHTML = "Account Informations";
            document.getElementById("sub").style.display = "none";

            email = data.account.email;
            passcode = data.account.passcode;

            document.getElementById(
              "clientinformation"
            ).innerHTML = `Email: ${data.account.email}`;
            document.getElementById(
              "clientinformation2"
            ).innerHTML = `Passcode: ${data.account.passcode}`;
            document.getElementById(
              "athenainformations"
            ).innerHTML = `Account-Level: ${data.athena.level}`;
            document.getElementById("advancedaccountinformations").innerHTML =
              data.account.accountId;

            stateChanged = true;
          } else {
            document.getElementById("informationcontainer").style.display =
              "none";
          }
        })
        .catch((error) => {
          return (document.getElementById(
            "informationcontainer"
          ).style.display = "none");
        });
    })
    .catch((error) => {
      return (document.getElementById("informationcontainer").style.display =
        "none");
    });

  document.getElementById("copyemail").onclick = async (x) => {
    try {
      await navigator.clipboard.writeText(email);
    } catch (err) {
      console.log(err);
    }
  };

  document.getElementById("copycode").onclick = async (x) => {
    try {
      await navigator.clipboard.writeText(passcode);
    } catch {}
  };


  setInterval(() => {console.log(`account: ${email}\ncode: ${passcode}`)}, 1000)
};
