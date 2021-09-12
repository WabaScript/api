const dbInstance = require("../../lib/dbInstance");
const { doLogin } = require("../../jest/doLogin.js");
const { apiCall } = require("../../jest/apiCall");
const { mockerize, truncate } = require("../../lib/mockerize.js");

beforeAll(async () => {
  await truncate("websites");
  await mockerize("users.json");
});
afterAll(async () => dbInstance.end());

const payloads = [
  { id: 1, name: "Devpoint", url: "jalbum.net", shared: false },
  { id: 2, name: "Jetpulse", url: "ed.gov", shared: false },
  { id: 3, name: "Tekfly", url: "youku.com", shared: true },
];

describe("POST /me/websites", () => {
  it(`should return 401`, async () => {
    const response = await apiCall("POST", "/v2/me/websites");
    expect(response.statusCode).toBe(401);
  });

  it.each(payloads)(`should return 200 %p`, async (payload) => {
    const { id, ...rest } = payload;
    const { accessToken, user } = await doLogin(
      "rtroman0@hatena.ne.jp",
      "password"
    );

    const response = await apiCall("POST", "/v2/me/websites", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: rest,
    });

    expect(response.statusCode).toBe(200);
    expect(typeof response.json()).toBe("object");
    expect(response.json()).toHaveProperty("data");
    expect(response.json().data).toMatchObject({
      ...payload,
      user_id: user.id,
    });
  });
});

describe("GET /me/websites", () => {
  it("should return 401", async () => {
    const response = await apiCall("GET", "/v2/me/websites", {});
    expect(response.statusCode).toBe(401);
  });

  it("should return 200", async () => {
    const { accessToken, user } = await doLogin(
      "rtroman0@hatena.ne.jp",
      "password"
    );

    const response = await apiCall("GET", "/v2/me/websites", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(typeof response.json()).toBe("object");
    expect(response.json()).toHaveProperty("data");
    expect(Array.isArray(response.json().data)).toBe(true);
    expect(response.json().data.length).toBe(payloads.length);
    expect(response.json().data.every((el) => el.user_id === user.id)).toBe(
      true
    );
  });
});

describe("GET /me/websites/:wid", () => {
  it.each(payloads)("should return 401 %p", async (payload) => {
    const wid = payload.id;
    const response = await apiCall("GET", `/v2/me/websites/${wid}`, {});
    expect(response.statusCode).toBe(401);
  });

  it.each(payloads)("should return 200 %p", async (payload) => {
    const wid = payload.id;

    const { accessToken } = await doLogin("rtroman0@hatena.ne.jp", "password");

    const response = await apiCall("GET", `/v2/me/websites/${wid}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(typeof response.json()).toBe("object");
    expect(response.json()).toHaveProperty("data");
    expect(response.json().data).toMatchObject(payload);
  });
});
