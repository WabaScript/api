const { Setting } = require("../lib/models");

const isInitialized = async () => {
  const appInitialized = await new Setting()
    .where("key", "APP_INITIALIZED")
    .fetch({ require: false });

  if (!appInitialized || appInitialized.get("value") !== "YES") {
    return false;
  }

  return true;
};

module.exports = { isInitialized };
