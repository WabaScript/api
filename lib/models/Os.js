const { dbInstance } = require("../dbInstance");
const { Event } = require("./Event");

const Os = dbInstance.model("Os", {
  tableName: "oses",

  events() {
    return this.hasMany(Event);
  },
});

module.exports = { Os };
