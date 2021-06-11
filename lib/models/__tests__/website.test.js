const { build } = require("../../../app");
const { refreshDb } = require("../../../jest/refreshDb");
const { dbInstance } = require("../../dbInstance");
const { Website } = require("../Website");

beforeAll(async () => refreshDb());

afterAll(async () => dbInstance.knex.destroy());

it.skip("should return the related website instances", async () => {
  await build();

  const seed = "40551333ba09839f5287a7a6aa2f73fe";
  const website = await new Website()
    .where("seed", seed)
    .fetch({ withRelated: ["user"] });

  expect(website.related("user").toJSON()).toMatchObject({
    id: expect.any(Number),
    firstname: expect.any(String),
    lastname: expect.any(String),
    email: expect.any(String),
  });
});
