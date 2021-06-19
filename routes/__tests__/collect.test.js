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

  it(`should return 200`, async () => {
    const response = await apiCall("POST", "/v2/collect", {
      payload: {
        element: "/",
        language: "en-GB",
        referrer: "",
        seed: "40551333ba09839f5287a7a6aa2f73fe",
        type: "pageView",
      },
    });

    expect(response.statusCode).toBe(200);
  });
});

// describe.each(putMeFixture)("PUT /me", (row) => {
//   it(`should return 401`, async () => {
//     const response = await apiCall("PUT", "/v2/me", { payload: row.data });
//     expect(response.statusCode).toBe(401);
//   });

//   it(`should return ${row.status}`, async () => {
//     const response = await apiCall("PUT", "/v2/me", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       payload: row.data,
//     });

//     expect(response.statusCode).toBe(row.status);
//   });
// });
