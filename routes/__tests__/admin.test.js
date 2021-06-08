const { build } = require("../../app.js");
const { user, website, browser } = require("../../jest/schema.js");

describe("api v2", () => {
  it("show the websites list", async () => {
    const app = build();
    const response = await app.inject({
      method: "GET",
      url: "/v2/websites",
    });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(JSON.parse(response.body))).toBe(true);
    expect(JSON.parse(response.body)[0]).toMatchObject({
      ...website,
      user: user,
    });
  });

  it("show the users list", async () => {
    const app = build();
    const response = await app.inject({
      method: "GET",
      url: "/v2/users",
    });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(JSON.parse(response.body))).toBe(true);
    expect(JSON.parse(response.body)[0]).toMatchObject(user);
  });

  it("show the browsers list", async () => {
    const app = build();
    const response = await app.inject({
      method: "GET",
      url: "/v2/browsers",
    });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(JSON.parse(response.body))).toBe(true);
    expect(JSON.parse(response.body)[0]).toMatchObject(browser);
  });
});
