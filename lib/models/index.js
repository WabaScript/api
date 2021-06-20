const { dbInstance } = require("../dbInstance");

const Website = dbInstance.model("Website", {
  tableName: "websites",

  user() {
    return this.belongsTo(User);
  },
});

const User = dbInstance.model("User", {
  tableName: "users",
  hidden: ["password"],

  websites() {
    return this.hasMany(Website);
  },
});

const Os = dbInstance.model("Os", {
  tableName: "oses",

  events() {
    return this.hasMany(Event);
  },
});

const Locale = dbInstance.model("Locale", {
  tableName: "locales",

  events() {
    return this.hasMany(Event);
  },
});

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

const Engine = dbInstance.model("Engine", {
  tableName: "engines",

  events() {
    return this.hasMany(Event);
  },
});

const Device = dbInstance.model("Device", {
  tableName: "devices",

  events() {
    return this.hasMany(Event);
  },
});

const Browser = dbInstance.model("Browser", {
  tableName: "browsers",

  events() {
    return this.hasMany(Event);
  },
});

module.exports = { Website, User, Os, Locale, Event, Engine, Device, Browser };
