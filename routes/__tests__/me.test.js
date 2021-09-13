const users = require("../../mocks/users.json");
const dbInstance = require("../../lib/dbInstance");
const { doLogin } = require("../../jest/doLogin.js");
const { apiCall } = require("../../jest/apiCall");
const { mockerize } = require("../../lib/mockerize.js");
const { getUserByEmail } = require("../../lib/db");
const { verify } = require("../../utils/hash");

beforeEach(async () => mockerize("users"));
afterAll(async () => dbInstance.end());

describe("GET /me", () => {
  it("should return 401", async () => {
    const response = await apiCall("GET", "/v2/me");
    expect(response.statusCode).toBe(401);
  });

  it.each(users)("should return 200 $email", async (user) => {
    const { accessToken } = await doLogin(user.email, "password");
    const response = await apiCall("GET", "/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({ data: user });
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

    const { accessToken } = await doLogin("rtroman0@hatena.ne.jp", "password");
    const response = await apiCall("PUT", "/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      payload: payload,
    });

    expect(response.statusCode).toBe(200);

    const user = await getUserByEmail(payload.email);

    expect(typeof user).toBe("object");
    expect(user.firstname).toBe(response.json().data.firstname);
    expect(user.lastname).toBe(response.json().data.lastname);
    expect(user.email).toBe(response.json().data.email);
  });

  it("should return 200", async () => {
    const payload = {
      firstname: "Wren",
      lastname: "Bilbee",
      email: "wbilbeed@thetimes.co.uk",
      password: "MUEkOBgo3W",
    };

    const { accessToken } = await doLogin("rtroman0@hatena.ne.jp", "password");
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
    const { accessToken } = await doLogin("rtroman0@hatena.ne.jp", "password");
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
    const { accessToken } = await doLogin("rtroman0@hatena.ne.jp", "password");
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
    const { accessToken } = await doLogin("rtroman0@hatena.ne.jp", "password");
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
    const { accessToken } = await doLogin("rtroman0@hatena.ne.jp", "password");
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
