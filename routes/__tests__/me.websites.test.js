const { doLogin } = require("../../jest/doLogin.js");
const { refreshDb } = require("../../jest/refreshDb.js");
const { apiCall } = require("../../jest/apiCall");
const { dbInstance } = require("../../lib/dbInstance");

const websites = require("../../jest/fixtures/models/websites.json");

let accessToken = null;

beforeAll(async () => {
  await refreshDb();
  accessToken = await doLogin("info@renatopozzi.me", "password");
});

afterAll(async () => dbInstance.knex.destroy());

describe("POST /me/websites", () => {
  it(`should return 401`, async () => {
    const response = await apiCall("POST", "/v2/me/websites");
    expect(response.statusCode).toBe(401);
  });
});

describe.each(websites)("POST /me/websites", (row) => {
  it(`should return 200 ${row.url}`, async () => {
    const response = await apiCall("POST", "/v2/me/websites", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: row,
    });

    expect(response.statusCode).toBe(200);
  });
});

describe("GET /me/websites", () => {
  it("should return 401", async () => {
    const response = await apiCall("GET", "/v2/me/websites");
    expect(response.statusCode).toBe(401);
  });

  it("should return 200", async () => {
    const response = await apiCall("GET", "/v2/me/websites", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
  });
});
