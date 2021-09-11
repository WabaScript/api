const dbInstance = require("../../lib/dbInstance");
const { apiCall } = require("../../jest/apiCall");
const { mockerize } = require("../../lib/mockerize.js");

afterAll(async () => dbInstance.end());
beforeEach(async () => mockerize("users.json"));

describe("login", () => {
  it("should not login", async () => {
    const response = await apiCall("POST", "/v2/auth/login", {
      payload: {
        email: "thisisbullshit@example.com",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Unauthorized",
    });
  });

  it("should not login", async () => {
    const response = await apiCall("POST", "/v2/auth/login");

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Unauthorized",
    });
  });

  it("should login", async () => {
    // valid user from mocks/users.json
    const response = await apiCall("POST", "/v2/auth/login", {
      payload: {
        email: "rtroman0@hatena.ne.jp",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toHaveProperty("access_token");
    expect(JSON.parse(response.body)).toHaveProperty("response_type");
    expect(JSON.parse(response.body).response_type).toBe("jwt");
  });
});

describe("logout", () => {
  it("should logout", async () => {
    const response = await apiCall("POST", "/v2/auth/logout");

    expect(response.statusCode).toBe(200);
    expect(response.headers["set-cookie"][0]).not.toBeNull();
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Logout succeded.",
    });
  });
});
