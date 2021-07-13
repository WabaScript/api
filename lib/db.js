const { hash } = require("../utils/hash");
const { Website, Setting } = require("./models");
const { User } = require("./models");
const { Browser } = require("./models");

const getAllWebsites = async () => {
  return await Website.fetchAll({ withRelated: ["user"] });
};

const getAllUsers = async () => {
  return await User.fetchAll();
};

const getAllBrowsers = async () => {
  return await Browser.fetchAll();
};

const getUserByEmail = async (email) => {
  return await User.where("email", email).fetch({ require: false });
};

const createUser = async (data) => {
  return await new User({ password: hash(data.password), ...data }).save();
};

const createSetting = async (data) => {
  return await new Setting(data).save();
};

module.exports = {
  getAllBrowsers,
  getAllUsers,
  getAllWebsites,
  getUserByEmail,
  createUser,
  createSetting,
};
