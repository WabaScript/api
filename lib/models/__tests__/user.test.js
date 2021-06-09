const { build } = require("../../../app");
const { refreshDb } = require("../../../jest/refreshDb");
const { dbInstance } = require("../../dbInstance");
const { website } = require("../../../jest/schema");
const { User } = require("../User");

beforeAll(async () => refreshDb());

afterAll(async () => dbInstance.knex.destroy());

it.skip("should return a related user instance", async () => {
  await build();

  const email = "info@renatopozzi.me";
  const user = await new User()
    .where("email", email)
    .fetch({ withRelated: ["websites"] });

  expect(user.related("websites").toJSON()[0]).toMatchObject(website);
});
