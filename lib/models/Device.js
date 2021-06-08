const { dbInstance } = require("../dbInstance");
const { Event } = require("./Event");

const Device = dbInstance.model("Device", {
  tableName: "devices",

  events() {
    return this.hasMany(Event);
  },
});

module.exports = { Device };
