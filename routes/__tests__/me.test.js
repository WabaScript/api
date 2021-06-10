const { build } = require("../../app.js");
const { doLogin } = require("../../jest/doLogin.js");
const { refreshDb } = require("../../jest/refreshDb.js");
const { user, website } = require("../../jest/schema.js");
const { dbInstance } = require("../../lib/dbInstance");

const putMeFixture = require("../../jest/fixtures/me/putMe.json");
const postMeWebsitesFixture = require("../../jest/fixtures/me/postMeWebsites.json");

let accessToken = null;

beforeAll(async () => {
  await refreshDb();
  accessToken = await doLogin("info@renatopozzi.me", "password");
});

afterAll(async () => dbInstance.knex.destroy());

describe("GET /me", () => {
  it("should return 401", async () => {
    const app = await build();
    const response = await app.inject({
      method: "GET",
      url: "/v2/me",
    });

    expect(response.statusCode).toBe(401);
  });

  it("should return 200", async () => {
    const app = await build();
    const response = await app.inject({
      method: "GET",
      url: "/v2/me",
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
    const app = await build();
    const response = await app.inject({
      method: "PUT",
      url: "/v2/me",
      payload: row.data,
    });

    expect(response.statusCode).toBe(401);
  });

  it(`should return ${row.status}`, async () => {
    const app = await build();
    const response = await app.inject({
      method: "PUT",
      url: "/v2/me",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: row.data,
    });

    expect(response.statusCode).toBe(row.status);
  });
});

describe("GET /me/websites", () => {
  it("should return 401", async () => {
    const app = await build();
    const response = await app.inject({
      method: "GET",
      url: "/v2/me/websites",
    });

    expect(response.statusCode).toBe(401);
  });

  it("should return 200", async () => {
    const app = await build();
    const response = await app.inject({
      method: "GET",
      url: "/v2/me/websites",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)[0]).toMatchObject(website);
  });
});

describe.each(postMeWebsitesFixture)("POST /me/websites", (row) => {
  it(`should return 401`, async () => {
    const app = await build();
    const response = await app.inject({
      method: "POST",
      url: "/v2/me/websites",
      payload: row.data,
    });

    expect(response.statusCode).toBe(401);
  });

  it(`should return ${row.status}`, async () => {
    const app = await build();
    const response = await app.inject({
      method: "POST",
      url: "/v2/me/websites",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: row.data,
    });

    expect(response.statusCode).toBe(row.status);
  });
});
