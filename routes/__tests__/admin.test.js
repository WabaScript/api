const { build } = require("../../app.js");

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
      id: expect.any(Number),
      name: expect.any(String),
      url: expect.any(String),
      seed: expect.any(String),
      shared: expect.any(Boolean),
      user_id: expect.any(Number),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });
});
