const prisma = require("../../lib/dbInstance");
const users = require("../../mocks/users.json");
const websites = require("../../mocks/websites.json");
const { build } = require("../../app");
const { ApiTest, AuthTest } = require("../../utils/tests");
const { createWebsite } = require("../../lib/db");

const app = build();

beforeEach(async () => {
  await prisma.user.deleteMany();
  await prisma.website.deleteMany();
  await prisma.user.createMany({ data: users });
});

// http://analytics.renatopozzi.me/v2/metrics?seed=DI3F2JDSKAK&resource=browsers&start=1929301842&end=249050050

describe("GET /v2/metrics", () => {
  beforeEach(async () => {
    await prisma.website.deleteMany();
  });

  it("should return 404 because the seed does not exits", async () => {
    const response = await new ApiTest(app)
      .url("/v2/metrics?seed=thisisntexists")
      .method("get")
      .call();

    expect(response.statusCode).toBe(404);
  });

  it("should return 401 because website is private and user is not authenticated", async () => {
    const website = await createWebsite({
      name: "Foo Website",
      url: "https://foo.bar",
      user_id: 1,
      is_public: false,
    });

    const response = await new ApiTest(app)
      .url(`/v2/metrics?seed=${website.id}`)
      .method("get")
      .call();

    expect(response.statusCode).toBe(401);
  });

  it("should return 200 because website is public and user is not authenticated", async () => {
    const website = await createWebsite({
      name: "Foo Website",
      url: "https://foo.bar",
      user_id: 1,
      is_public: true,
    });

    const response = await new ApiTest(app)
      .url(`/v2/metrics?seed=${website.id}`)
      .method("get")
      .call();

    expect(response.statusCode).toBe(200);
  });

  it("should return 401 because website is private and user is authenticated but does not own it", async () => {
    const user = await new AuthTest(app).signIn();
    const website = await createWebsite({
      name: "Foo Website",
      url: "https://foo.bar",
      user_id: 2,
      is_public: false,
    });

    const response = await new ApiTest(app)
      .url(`/v2/metrics?seed=${website.id}`)
      .headers({ Authorization: `Bearer ${user.accessToken}` })
      .method("get")
      .call();

    expect(response.statusCode).toBe(401);
  });

  it("should return 200 because website is private and user is authenticated and owns it", async () => {
    const user = await new AuthTest(app).signIn();
    const website = await createWebsite({
      name: "Foo Website",
      url: "https://foo.bar",
      user_id: user.id,
      is_public: false,
    });

    const response = await new ApiTest(app)
      .url(`/v2/metrics?seed=${website.id}`)
      .headers({ Authorization: `Bearer ${user.accessToken}` })
      .method("get")
      .call();

    expect(response.statusCode).toBe(200);
  });

  it("should return correctly the events for a website", async () => {
    const user = await new AuthTest(app).signIn();
    const website = await createWebsite({
      name: "Foo Website",
      url: "https://foo.bar",
      user_id: user.id,
      is_public: false,
    });

    const response = await new ApiTest(app)
      .url(`/v2/metrics?seed=${website.id}`)
      .headers({ Authorization: `Bearer ${user.accessToken}` })
      .method("get")
      .call();

    expect(response.statusCode).toBe(200);
  });
});
