const { dbInstance } = require("../dbInstance");
const { Event } = require("./Event");

const Browser = dbInstance.model("Browser", {
  tableName: "browsers",

  events() {
    return this.hasMany(Event);
  },
});

module.exports = { Browser };
