const { createDb } = require("../createDb");

describe("Testing createDb factory", () => {
  it("throws an error", () => {
    expect(
      createDb(null, {
        user: null,
        host: null,
        password: null,
        port: null,
      })
    ).toThrow();
  });
});
