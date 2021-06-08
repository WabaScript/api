const { dbInstance } = require("../dbInstance");
const { Event } = require("./Event");

const Engine = dbInstance.model("Engine", {
  tableName: "engines",

  events() {
    return this.hasMany(Event);
  },
});

module.exports = { Engine };
