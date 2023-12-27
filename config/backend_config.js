global.backendCfg = {
  backend_port: 7474,
  websocket_port: 7575,
  activate_queue: false,
  maintenance: false,
  dev: {
    allow_restart_route: false,
    disable_intervals: false,
  },
  tinfoil_server: {
    active: true,
  },
  overwrite_os: {
    active: false,
    os: "",
  },
  db: {
    connect: true,
    host: "mongodb://127.0.0.1/curiumdb",
  },
  shop: {
    ItemShop: {
      useExternShopAPI: true,
      shopAPI: "https://api.nitestats.com/v1/epic/store",
    },
    VbucksShop: {
      website: "http://127.0.0.1:SERVER_PORT/vbucksnotice",
    },
  },
};
