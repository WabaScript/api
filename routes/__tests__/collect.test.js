const prisma = require("../../lib/dbInstance");
const { build } = require("../../app");
const { ApiTest } = require("../../utils/tests");

const app = build();

const data = {
  type: "pageView",
  element: "/",
  wid: "1",
  language: "en-GB",
};

describe("POST /collect", () => {
  let website;

  beforeAll(async () => {
    website = await prisma.website.create({
      data: {
        name: "Renato Pozzi Website",
        url: "www.renatopozzi.me",
        is_public: false,
        user_id: 1,
      },
    });
  });

  it("should return 400 because type is required", async () => {
    const { type, ...rest } = data;
    const response = await new ApiTest(app)
      .url("/v2/collect")
      .method("post")
      .payload({ ...rest })
      .call();

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 because element is required", async () => {
    const { element, ...rest } = data;
    const response = await new ApiTest(app)
      .url("/v2/collect")
      .method("post")
      .payload({ ...rest })
      .call();

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 because wid is required", async () => {
    const { wid, ...rest } = data;
    const response = await new ApiTest(app)
      .url("/v2/collect")
      .method("post")
      .payload({ ...rest })
      .call();

    expect(response.statusCode).toBe(400);
  });

  it("should return 404 because wid does not exists", async () => {
    const { ...rest } = data;
    const response = await new ApiTest(app)
      .url("/v2/collect")
      .method("post")
      .payload({ ...rest })
      .call();

    expect(response.statusCode).toBe(404);
    expect(response.json()).toMatchObject({
      message: "Aurora ID not defined..",
    });
  });

  it("should collect data correctly", async () => {
    const { wid, ...rest } = data;
    const response = await new ApiTest(app)
      .url("/v2/collect")
      .method("post")
      .payload({ wid: website.id, ...rest })
      .call();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty("data");
  });
});
