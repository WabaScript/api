const { dbInstance } = require("../dbInstance");
const { Browser } = require("./Browser");
const { Device } = require("./Device");
const { Engine } = require("./Engine");
const { Locale } = require("./Locale");
const { Os } = require("./Os");
const { Website } = require("./Website");

const Event = dbInstance.model("Event", {
  tableName: "events",

  os() {
    return this.belongsTo(Os);
  },
  device() {
    return this.belongsTo(Device);
  },
  engine() {
    return this.belongsTo(Engine);
  },
  locale() {
    return this.belongsTo(Locale);
  },
  website() {
    return this.belongsTo(Website);
  },
  browser() {
    return this.belongsTo(Browser);
  },
});

module.exports = { Event };
