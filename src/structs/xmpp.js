const app = require("express")();
const { Server } = require("ws");
const xmlbuild = require("xmlbuilder");
const xmlparse = require("xml-parser");
const uuid = require("uuid");

const User = require("../../model/user.js");
const log = require("../structs/log.js");
const matchmaker = require("./matchmaker.js");

const wss = new Server({ server: app.listen(global.backendCfg.websocket_port) });

app.use((req, res, next) => {
  res.set({
    "X-Server-Time": new Date().toISOString(),
    "X-Powered-By": "SecretsServer",
  });
  next();
});

app.use((req, res, next) => {
  res.json({
    code: 200,
    message: "XMPP status is ok",
    status: "UP",
    clients: global.clientCfg.xmppClients,
  });
});

wss.on("listening", () => {
  setTimeout(() => {
    log.xmpp(`Started listening on port ${global.backendCfg.websocket_port}`);
  }, 1500);
});

wss.on("error", (error) => {
  log.error("Failed to start listening!\nXMPP will not be available.");
});

wss.on("connection", async (ws) => {
  const id = uuid.v4();
  let epicId = { id: "", res: "" };
  let accountId;
  let auth = false;

  if (ws.protocol.toLowerCase() != "xmpp") {
    return matchmaker(ws);
  }

  ws.on("message", async (message) => {
    if (Buffer.isBuffer(message)) {
      message = message.toString();
    }

    switch (xmlparse(message).root.name) {
      case "open": {
        ws.send(
          xmlbuild
            .create("open")
            .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-framing")
            .attribute("from", "prod.ol.epicgames.com")
            .attribute("id", id)
            .attribute("version", "1.0")
            .attribute("xml:lang", "en")
            .toString()
        );

        if (auth) {
          ws.send(
            xmlbuild
              .create("stream:features")
              .attribute("xmlns:stream", "http://etherx.jabber.org/streams")
              .element("ver")
              .attribute("xmlns", "urn:xmpp:features:rosterver")
              .up()
              .element("starttls")
              .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-tls")
              .up()
              .element("bind")
              .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-bind")
              .up()
              .element("compression")
              .attribute("xmlns", "http://jabber.org/features/compress")
              .element("method", "zlib")
              .up()
              .up()
              .element("session")
              .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-session")
              .up()
              .toString()
          );
        } else {
          ws.send(
            xmlbuild
              .create("stream:features")
              .attribute("xmlns:stream", "http://etherx.jabber.org/streams")
              .element("mechanisms")
              .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-sasl")
              .element("mechanism", "PLAIN")
              .up()
              .up()
              .element("ver")
              .attribute("xmlns", "urn:xmpp:features:rosterver")
              .up()
              .element("starttls")
              .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-tls")
              .up()
              .element("compression")
              .attribute("xmlns", "http://jabber.org/features/compress")
              .element("method", "zlib")
              .up()
              .up()
              .element("auth")
              .attribute("xmlns", "http://jabber.org/features/iq-auth")
              .up()
              .toString()
          );
        }
        break;
      }
      case "auth": {
        if (
          !xmlparse(message).root.content ||
          !Buffer.from(xmlparse(message).root.content, "base64").toString() ||
          !Buffer.from(xmlparse(message).root.content, "base64")
            .toString()
            .includes("\u0000")
        ) {
          ws.send(
            xmlbuild
              .create("close")
              .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-framing")
              .toString()
          );
          ws.close();
        }

        accountId = Buffer.from(xmlparse(message).root.content, "base64")
          .toString()
          .split("\u0000")[1];

        // success
        const user = await User.findOne({ accountId: accountId });

        if (!JSON.stringify(global.clients).includes(accountId)) {
          log.xmpp(`${user.displayName} logged into xmpp server.`);
          global.clients.amount++;
          global.clients.ids.push({
            type: "websocket",
            accountId: accountId,
            displayName: user.displayName,
            presence: {
              status: {},
              online: true,
            },
          });
        }

        ws.send(
          xmlbuild
            .create("success")
            .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-sasl")
            .toString()
        );
        break;
      }

      case "iq": {
        switch (xmlparse(message).root.attributes.id) {
          case "_xmpp_bind1": {
            if (
              !xmlparse(message).root.children.find((x) => x.name == "bind") ||
              !xmlparse(message)
                .root.children.find((x) => x.name == "bind")
                .children.find((x) => x.name == "resource")
            ) {
              return;
            }

            epicId.push({
              id: accountId + "@prod.ol.epicgames.com",
              res:
                accountId +
                "@prod.ol.epicgames.com" +
                xmlparse(message).root.children.find((x) => x.name == "bind")
                  .content,
            });

            log.xmpp(JSON.stringify(epicId));

            ws.send(
              xmlbuild
                .create("iq")
                .attribute("to", epicId.res)
                .attribute("id", "_xmpp_bind1")
                .attribute("xmlns", "jabber:client")
                .attribute("type", "result")
                .element("bind")
                .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-bind")
                .element("jid", epicId.res)
                .up()
                .up()
                .toString()
            );
            break;
          }
          case "xmpp_session1": {
            if (!global.clients.client_ids.find((x) => x.clients == ws)) {
              return ws.close();
            }

            ws.send(
              xmlbuild
                .create("iq")
                .attribute("to", epicId.res)
                .attribute("from", "prod.ol.epicgames.com")
                .attribute("id", "_xmpp_session1")
                .attribute("xmlns", "jabber:client")
                .attribute("type", "result")
                .toString()
            );
            break;
          }
          default: {
            if (!global.clients.client_ids.find((x) => x.clients == ws)) {
              return ws.close();
            }

            // fix needed.
            ws.send(
              xmlbuild
                .create("iq")
                .attribute("to", jid)
                .attribute("from", "prod.ol.epicgames.com")
                .attribute("id", msg.root.attributes.id)
                .attribute("xmlns", "jabber:client")
                .attribute("type", "result")
                .toString()
            );
            break;
          }
        }
      }
    }

    /*log.xmpp(
      `[Client Message - ${xmlparse(message).root.name}]: ${JSON.stringify(
        xmlparse(message)
      )}`
    );*/
  });
});
