const { Website } = require("./models");
const { User } = require("./models");
const { Browser } = require("./models");

const getAllWebsites = async () => {
  return await new Website().fetchAll({ withRelated: ["user"] });
};

const getAllUsers = async () => {
  return await new User().fetchAll();
};

const getAllBrowsers = async () => {
  return await new Browser().fetchAll();
};

const getUserByEmail = async (email) => {
  return await new User().where("email", email).fetch({ require: false });
};

module.exports = {
  getAllBrowsers,
  getAllUsers,
  getAllWebsites,
  getUserByEmail,
};
