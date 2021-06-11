const { doLogin } = require("../../jest/doLogin.js");
const { refreshDb } = require("../../jest/refreshDb.js");
const { user } = require("../../jest/schema.js");
const { apiCall } = require("../../jest/apiCall");
const { dbInstance } = require("../../lib/dbInstance");

const putMeFixture = require("../../jest/fixtures/me/putMe.json");

let accessToken = null;

beforeAll(async () => {
  await refreshDb();
  accessToken = await doLogin("info@renatopozzi.me", "password");
});

afterAll(async () => dbInstance.knex.destroy());

describe("GET /me", () => {
  it("should return 401", async () => {
    const response = await apiCall("GET", "/v2/me");
    expect(response.statusCode).toBe(401);
  });

  it("should return 200", async () => {
    const response = await apiCall("GET", "/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject(user);
  });
});

describe.each(putMeFixture)("PUT /me", (row) => {
  it(`should return 401`, async () => {
    const response = await apiCall("PUT", "/v2/me", { payload: row.data });
    expect(response.statusCode).toBe(401);
  });

  it(`should return ${row.status}`, async () => {
    const response = await apiCall("PUT", "/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: row.data,
    });

    expect(response.statusCode).toBe(row.status);
  });
});
