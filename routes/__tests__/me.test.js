require("dotenv").config();
const dbInstance = require("../../lib/dbInstance");
const { doLogin } = require("../../jest/doLogin.js");
// const { refreshDb } = require("../../jest/refreshDb.js");
const { apiCall } = require("../../jest/apiCall");

//const putMeFixture = require("../../jest/fixtures/me/putMe.json");
const { mockerize } = require("../../lib/mockerize.js");
const { getUserByEmail } = require("../../lib/db");
const { verify } = require("../../utils/hash");

//let accessToken = null;

// beforeAll(async () => {
//   await refreshDb();
//   accessToken = await doLogin("info@renatopozzi.me", "password");
// });

afterAll(async () => dbInstance.end());

beforeEach(async () => mockerize("users.json"));

describe("GET /me", () => {
  it("should return 401", async () => {
    const response = await apiCall("GET", "/v2/me");
    expect(response.statusCode).toBe(401);
  });

  it("should return 200", async () => {
    const accessToken = await doLogin("rtroman0@hatena.ne.jp", "password");
    const response = await apiCall("GET", "/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      data: {
        id: expect.any(Number),
        firstname: expect.any(String),
        lastname: expect.any(String),
        email: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
    });
  });
});

describe("PUT /me", () => {
  it("should return 401", async () => {
    const response = await apiCall("PUT", "/v2/me", {});
    expect(response.statusCode).toBe(401);
  });

  it("should return 200", async () => {
    const payload = {
      firstname: "Teador",
      lastname: "Devonside",
      email: "tdevonside0@europa.eu",
    };

    const accessToken = await doLogin("rtroman0@hatena.ne.jp", "password");
    const response = await apiCall("PUT", "/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: payload,
    });

    expect(response.statusCode).toBe(200);

    const user = await getUserByEmail(payload.email);

    expect(typeof user).toBe("object");
    expect(user.firstname).toBe(payload.firstname);
    expect(user.lastname).toBe(payload.lastname);
    expect(user.email).toBe(payload.email);
  });

  it("should return 200", async () => {
    const payload = {
      firstname: "Wren",
      lastname: "Bilbee",
      email: "wbilbeed@thetimes.co.uk",
      password: "MUEkOBgo3W",
    };

    const accessToken = await doLogin("rtroman0@hatena.ne.jp", "password");
    const response = await apiCall("PUT", "/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: payload,
    });

    expect(response.statusCode).toBe(200);

    const user = await getUserByEmail(payload.email);

    expect(typeof user).toBe("object");
    expect(user.firstname).toBe(payload.firstname);
    expect(user.lastname).toBe(payload.lastname);
    expect(user.email).toBe(payload.email);
    expect(verify(payload.password, user.password)).toBe(true);
  });

  it("should return 400", async () => {
    const accessToken = await doLogin("rtroman0@hatena.ne.jp", "password");
    const response = await apiCall("PUT", "/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: {
        firstname: null,
        lastname: null,
        email: "cborsi1@biblegateway.com",
        password: "eBDz5InlWj3",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400", async () => {
    const accessToken = await doLogin("rtroman0@hatena.ne.jp", "password");
    const response = await apiCall("PUT", "/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: {
        firstname: null,
        lastname: "Tether",
        email: "jtether2@tinypic.com",
        password: "t1KbIkBa9m2k",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400", async () => {
    const accessToken = await doLogin("rtroman0@hatena.ne.jp", "password");
    const response = await apiCall("PUT", "/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: {
        firstname: "Berti",
        lastname: "Sproat",
        email: "bsproat3@amazon.com",
        password: "FaOyik1",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400", async () => {
    const accessToken = await doLogin("rtroman0@hatena.ne.jp", "password");
    const response = await apiCall("PUT", "/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: {
        firstname: "Sam",
        lastname: "Bakeup",
        email: null,
        password: "Y2gceWkzIRX",
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
