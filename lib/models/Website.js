const { dbInstance } = require("../dbInstance");
const { User } = require("./User");

const Website = dbInstance.model("Website", {
  tableName: "websites",

  user() {
    return this.belongsTo(User);
  },
});

module.exports = { Website };
