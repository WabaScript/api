require("dotenv").config();
const dbInstance = require("../dbInstance");
const { mockerize } = require("../mockerize");
const {
  getUser,
  getWebsite,
  getUserWebsites,
  updateWebsite,
  deleteWebsite,
  createWebsite,
  createUser,
  updateUser,
  createSetting,
  deleteSetting,
  getSetting,
  getUserByEmail,
} = require("../db");

afterAll(async () => dbInstance.end());

const findById = (data, id) => data.find((el, index) => index === id);

describe("getUser", () => {
  it("should return an user", async () => {
    const uid = 2;
    const users = await mockerize("users.json");
    const user = await getUser(uid);
    expect(typeof user).toBe("object");
  });

  it("should be null", async () => {
    const uid = 101;
    const user = await getUser(uid);
    expect(user).toBe(null);
  });
});

describe("getUserByEmail", () => {
  it("should return an user", async () => {
    const users = await mockerize("users.json");
    const user = await getUserByEmail(users[1].email);
    expect(typeof user).toBe("object");
  });

  it("should be null", async () => {
    const user = await getUserByEmail("anonymous@ieh.gov");
    expect(user).toBe(null);
  });
});

describe("createUser", () => {
  it("should create the user", async () => {
    const data = {
      firstname: "Abie",
      lastname: "Sholem",
      email: "asholem2q@gold.co.uk",
    };

    const createdUser = await createUser(Object.values(data), "password");
    expect(createdUser).toMatchObject(data);

    const user = await getUser(createdUser.id);
    expect(user).toMatchObject(data);
  });
});

describe("updateUser", () => {
  it("should update the user", async () => {
    const uid = 1;
    await mockerize("users.json");
    const data = {
      firstname: "thisisupdated",
      lastname: "alsoupdated",
      email: "updated@example.com",
    };
    const updatedUser = await updateUser(uid, Object.values(data));

    expect(updatedUser).toHaveProperty("firstname");
    expect(updatedUser.firstname).toBe(data.firstname);
    expect(updatedUser).toHaveProperty("lastname");
    expect(updatedUser.lastname).toBe(data.lastname);
    expect(updatedUser).toHaveProperty("email");
    expect(updatedUser.email).toBe(data.email);
  });
});

// TODO: mockerize in beforeEach?
describe("getWebsite", () => {
  it("should return a website", async () => {
    const wid = 2;
    const websites = await mockerize("websites.json");
    const website = await getWebsite(wid);
    expect(typeof website).toBe("object");
    expect(website.shared).toBe(false);
  });

  it("should be null", async () => {
    const wid = 101;
    const website = await getWebsite(wid);
    expect(website).toBe(null);
  });
});

describe("getUserWebsites", () => {
  it("should return the user websites", async () => {
    const uid = 1;
    const mockedWebsites = await mockerize("websites.json");
    const websites = await getUserWebsites(uid);
    expect(websites).toMatchObject(
      mockedWebsites.filter((el) => el.used_id === uid)
    );
  });

  it("should be null", async () => {
    const wid = 101;
    const website = await getWebsite(wid);
    expect(website).toBe(null);
  });
});

describe("updateWebsite", () => {
  it("should update the website", async () => {
    const wid = 1;
    await mockerize("websites.json");
    const data = { name: "thisisupdated", url: "www.thisisupdated.com" };
    const updatedWebsite = await updateWebsite(wid, [
      data.name,
      data.url,
      false,
    ]);

    expect(updatedWebsite).toHaveProperty("name");
    expect(updatedWebsite.name).toBe(data.name);
    expect(updatedWebsite).toHaveProperty("url");
    expect(updatedWebsite.url).toBe(data.url);
    expect(updatedWebsite).toHaveProperty("shared");
    expect(updatedWebsite.shared).toBe(false);
  });
});

describe("deleteWebsite", () => {
  it("should delete the website", async () => {
    const wid = 1;
    await mockerize("websites.json");
    const deletedRows = await deleteWebsite(wid);
    const website = await getWebsite(wid);
    expect(deletedRows).toBe(1);
    expect(website).toBe(null);
  });
});

describe("createWebsite", () => {
  it("should create the website", async () => {
    const uid = 1;
    const data = {
      name: "thisiscreated",
      url: "www.thisiscreated.com",
      shared: true,
      user_id: uid,
    };

    const createdWebsite = await createWebsite(Object.values(data));
    expect(createdWebsite).toMatchObject(data);

    const website = await getWebsite(createdWebsite.id);
    expect(website).toMatchObject(data);
  });

  it("should create the website with int boolean", async () => {
    const uid = 1;
    const data = {
      name: "specialbool",
      url: "www.specialbool.com",
      shared: 0,
      user_id: uid,
    };

    const createdWebsite = await createWebsite(Object.values(data));
    expect(createdWebsite.shared).toBe(false);

    const website = await getWebsite(createdWebsite.id);
    expect(website.shared).toBe(false);
  });
});

describe("getSetting", () => {
  it("should return a setting", async () => {
    const key = "FOO_SETTING";
    const settings = await mockerize("settings.json");
    const setting = await getSetting(key);
    expect(setting).toMatchObject(settings.find((el) => el.key === key));
  });

  it("should be null", async () => {
    const key = "NOT_EXISTENT";
    const setting = await getSetting(key);
    expect(setting).toBe(null);
  });
});

describe("createSetting", () => {
  it("should create a settings record", async () => {
    const data = {
      key: "MY_SETTING",
      value: "accomplished",
    };

    const createdSetting = await createSetting(data.key, data.value);
    expect(createdSetting).toMatchObject(data);
  });
});

describe("deleteSetting", () => {
  it("should delete the setting", async () => {
    const key = "FOO_SETTING";
    await mockerize("settings.json");
    const deletedRows = await deleteSetting(key);
    const setting = await getSetting(key);
    expect(deletedRows).toBe(1);
    expect(setting).toBe(null);
  });
});
