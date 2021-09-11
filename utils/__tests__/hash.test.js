const { hash, verify } = require("../hash");

describe("Testing Hash & Verify Works!", () => {
  it("should return true", () => {
    const ptw = "password";
    expect(verify(ptw, hash(ptw))).toBe(true);
  });

  it("should return null", () => {
    expect(hash(null)).toBe(null);
  });

  it("should return false", () => {
    const ptw = "password";
    expect(verify(ptw, hash("differentPtw"))).toBe(false);
  });
});
