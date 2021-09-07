const { format } = require("../response");

describe("format", () => {
  it("should return only data", () => {
    const data = { hello: "world" };
    const formatted = format(data);

    expect(formatted).toMatchObject({ data: data });
  });

  it("should return also status", () => {
    const data = { hello: "world" };
    const formatted = format(data, { status: 200 });

    expect(formatted).toMatchObject({ data: data, status: 200 });
  });
});
