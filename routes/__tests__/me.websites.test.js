const users = require("../../mocks/users.json");
const websites = require("../../mocks/websites.json");
const dbInstance = require("../../lib/dbInstance");
const { doLogin } = require("../../jest/doLogin.js");
const { apiCall } = require("../../jest/apiCall");
const { truncate } = require("../../lib/mockerize.js");
const { getUserWebsites } = require("../../lib/db");

beforeAll(async () => truncate("websites"));
afterAll(async () => dbInstance.end());

describe("POST /me/websites", () => {
  it(`should return 401`, async () => {
    const response = await apiCall("POST", "/v2/me/websites");
    expect(response.statusCode).toBe(401);
  });

  it.each(websites)(`should return 200 $url`, async (website) => {
    const { name, url, shared } = website;
    const { accessToken, user } = await doLogin(
      "rtroman0@hatena.ne.jp",
      "password"
    );

    const response = await apiCall("POST", "/v2/me/websites", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: { name, url, shared },
    });

    expect(response.statusCode).toBe(200);
    expect(typeof response.json()).toBe("object");
    expect(response.json()).toHaveProperty("data");
    expect(response.json().data).toMatchObject({
      name: name,
      url: url,
      shared: shared,
      user_id: user.id,
    });
  });
});

describe("GET /me/websites", () => {
  it("should return 401", async () => {
    const response = await apiCall("GET", "/v2/me/websites", {});
    expect(response.statusCode).toBe(401);
  });

  it.each(users)("should return user $email websites", async (u) => {
    const { accessToken, user } = await doLogin(u.email, "password");

    const response = await apiCall("GET", "/v2/me/websites", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(typeof response.json()).toBe("object");
    expect(response.json()).toHaveProperty("data");
    expect(Array.isArray(response.json().data)).toBe(true);
    expect(response.json().data.every((el) => el.user_id === user.id)).toBe(
      true
    );
  });
});

describe("GET /me/websites/:wid", () => {
  it.each([1, 3, 4, 5, 6, 8, 10, 13])("should return 401 %p", async (wid) => {
    const response = await apiCall("GET", `/v2/me/websites/${wid}`, {});
    expect(response.statusCode).toBe(401);
  });

  it.each(users)("should return 200 $email", async (u) => {
    const { accessToken, user } = await doLogin(u.email, "password");
    const websites = await getUserWebsites(user.id);

    for (const website of websites) {
      const response = await apiCall("GET", `/v2/me/websites/${website.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Removed for matching.
      const { created_at, updated_at, ...rest } = website;

      expect(response.statusCode).toBe(200);
      expect(typeof response.json()).toBe("object");
      expect(response.json()).toHaveProperty("data");
      expect(response.json().data).toMatchObject(rest);
    }
  });
});
