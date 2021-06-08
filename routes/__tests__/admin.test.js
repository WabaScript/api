const { build } = require("../../app.js");
const { user, website, browser } = require("../../jest/schema.js");
const { dbInstance } = require("../../lib/dbInstance");

afterAll(async () => await dbInstance.knex.destroy());

describe("api v2", () => {
  it.skip("show the websites list", async () => {
    const app = await build();
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

  it.skip("show the users list", async () => {
    const app = await build();
    const response = await app.inject({
      method: "GET",
      url: "/v2/users",
    });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(JSON.parse(response.body))).toBe(true);
    expect(JSON.parse(response.body)[0]).toMatchObject(user);
  });

  it.skip("show the browsers list", async () => {
    const app = await build();
    const response = await app.inject({
      method: "GET",
      url: "/v2/browsers",
    });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(JSON.parse(response.body))).toBe(true);
    expect(JSON.parse(response.body)[0]).toMatchObject(browser);
  });
});
