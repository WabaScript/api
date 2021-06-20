const { doLogin } = require("../../jest/doLogin.js");
const { refreshDb } = require("../../jest/refreshDb.js");
const { apiCall } = require("../../jest/apiCall");
const { dbInstance } = require("../../lib/dbInstance");

beforeAll(async () => refreshDb());

afterAll(async () => dbInstance.knex.destroy());

describe("GET /collect", () => {
  it("should return 404", async () => {
    const response = await apiCall("GET", "/v2/collect");
    expect(response.statusCode).toBe(404);
  });
});

describe("POST /collect", () => {
  it("should return 400", async () => {
    const response = await apiCall("POST", "/v2/collect");
    expect(response.statusCode).toBe(400);
  });

  it(`should return 400`, async () => {
    const response = await apiCall("POST", "/v2/collect", {
      payload: {
        element: "/",
        language: "en-GB",
        referrer: "",
        seed: "this_seed_is_not_present",
        type: "pageView",
        fingerprint: "thisismyfp",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Aurora ID not defined..",
    });
  });

  it(`should return 200`, async () => {
    const response = await apiCall("POST", "/v2/collect", {
      payload: {
        element: "/",
        language: "en-GB",
        referrer: "",
        seed: "40551333ba09839f5287a7a6aa2f73fe",
        type: "pageView",
        fingerprint: "thisismyfp",
      },
    });

    expect(response.statusCode).toBe(200);
  });
});

describe("POST /collect/:id", () => {
  it("should return 400", async () => {
    const response = await apiCall("POST", "/v2/collect/thisisnotpresent");
    expect(response.statusCode).toBe(400);
  });

  it.skip(`should return 400`, async () => {
    const response = await apiCall("POST", "/v2/collect/id", {
      payload: {
        seed: "this_seed_is_not_present",
        duration: 1000,
      },
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Aurora ID not defined..",
    });
  });
});
