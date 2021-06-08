const { dbInstance } = require("../dbInstance");
const { Event } = require("./Event");

const Locale = dbInstance.model("Locale", {
  tableName: "locales",

  events() {
    return this.hasMany(Event);
  },
});

module.exports = { Locale };
