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

const getUserWebsites = async (id) => {
  return await Website.where("user_id", id).fetchAll();
};

const getUserWebsite = async (uid, seed) => {
  return await Website.where("user_id", uid).where("seed", seed).fetch();
};

const updateUserWebsite = async (uid, seed, data) => {
  return await Website.where("user_id", uid)
    .where("seed", seed)
    .save({ shared: Boolean(Number(data.shared)), ...data }, { patch: true });
};

const deleteUserWebsite = async (uid, seed) => {
  return await Website.where("user_id", uid).where("seed", seed).destroy();
};

const createUserWebsite = async (uid, data) => {
  return await new Website({
    shared: Boolean(Number(data.shared)),
    user_id: uid,
    ...data,
  }).save();
};

const createUser = async (data) => {
  return await new User({ password: hash(data.password), ...data }).save();
};

const updateUser = async (id, data) => {
  if (data.password) {
    data.password = hash("password");
  }

  return await User.where("id", id).save({ ...data }, { patch: true });
};

const createSetting = async (data) => {
  return await new Setting(data).save();
};

module.exports = {
  getAllBrowsers,
  getAllUsers,
  getAllWebsites,
  getUserByEmail,
  getUserWebsites,
  getUserWebsite,
  createUser,
  createSetting,
  createUserWebsite,
  updateUser,
  updateUserWebsite,
  deleteUserWebsite,
};
