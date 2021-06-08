const { dbInstance } = require("../dbInstance");
const { Website } = require("./Website");

const User = dbInstance.model("User", {
  tableName: "users",
  hidden: ["password"],

  websites() {
    return this.hasMany(Website);
  },
});

module.exports = { User };
