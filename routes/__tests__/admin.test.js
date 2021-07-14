const { user, website } = require("../../jest/schema.js");
const { doLogin } = require("../../jest/doLogin.js");
const { refreshDb } = require("../../jest/refreshDb.js");
const { apiCall } = require("../../jest/apiCall");
const { dbInstance } = require("../../lib/dbInstance");

let accessToken = null;

beforeAll(async () => {
  await refreshDb();
  accessToken = await doLogin("info@renatopozzi.me", "password");
});

afterAll(async () => dbInstance.knex.destroy());

describe("api v2", () => {
  it("should return 401", async () => {
    const response = await apiCall("GET", "/v2/websites");
    expect(response.statusCode).toBe(401);
  });

  it("should return 200", async () => {
    const response = await apiCall("GET", "/v2/websites", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(JSON.parse(response.body))).toBe(true);
    expect(JSON.parse(response.body)[0]).toMatchObject({
      ...website,
      user: user,
    });
  });

  it("should return 401", async () => {
    const response = await apiCall("GET", "/v2/users");
    expect(response.statusCode).toBe(401);
  });

  it("should return 200", async () => {
    const response = await apiCall("GET", "/v2/users", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(JSON.parse(response.body))).toBe(true);
    expect(JSON.parse(response.body)[0]).toMatchObject(user);
  });

  it("should return 401", async () => {
    const response = await apiCall("GET", "/v2/browsers");
    expect(response.statusCode).toBe(401);
  });

  it("should return 200", async () => {
    const response = await apiCall("GET", "/v2/browsers", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(JSON.parse(response.body))).toBe(true);
  });
});
