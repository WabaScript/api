const { doLogin } = require("../../jest/doLogin.js");
const { apiCall } = require("../../jest/apiCall");
const { dbInstance } = require("../../lib/dbInstance");

beforeAll(async () => {
  await dbInstance.knex.migrate.rollback();
  await dbInstance.knex.migrate.latest();

  await dbInstance.knex("users").del();
  await dbInstance.knex("users").insert({
    firstname: "Renato",
    lastname: "Pozzi",
    email: "info@renatopozzi.me",
    password: "$2a$10$7AtT.hJHqS.o9alESCm70OTMy5/3nNztt3vDoqgjwKxK9CZieCmZm",
  });

  await dbInstance.knex("websites").del();
  await dbInstance.knex("websites").insert({
    name: "Renato Pozzi Website.",
    url: "https://renatopozzi.me",
    seed: "40551333ba09839f5287a7a6aa2f73fe",
    shared: false,
    user_id: 1,
  });
  await dbInstance.knex("websites").insert({
    name: "My Shared Website.",
    url: "https://mysharedwebsite.come",
    seed: "znz29v2gikf6ni3cytfeapp4t28h69jx",
    shared: true,
    user_id: 1,
  });
});

afterAll(async () => dbInstance.knex.destroy());

describe.each(["browser", "country", "os", "page", "referrer"])(
  "Different Targets",
  (target) => {
    it("should return 404", async () => {
      const seed = "this_not_exists";
      const response = await apiCall(
        "GET",
        `/v2/metrics/${seed}/views/${target}`
      );
      expect(response.statusCode).toBe(404);
    });

    describe("Not Shared Website", () => {
      const seed = "40551333ba09839f5287a7a6aa2f73fe";

      it("should return 401", async () => {
        const response = await apiCall(
          "GET",
          `/v2/metrics/${seed}/views/${target}`
        );
        expect(response.statusCode).toBe(401);
      });

      it("should return 200", async () => {
        const accessToken = await doLogin("info@renatopozzi.me", "password");
        const response = await apiCall(
          "GET",
          `/v2/metrics/${seed}/views/${target}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        expect(response.statusCode).toBe(200);
      });

      describe.each(["day", "week", "month", "year"])(
        "Different Ranges",
        (range) => {
          it(`should return 200 ${range}`, async () => {
            const accessToken = await doLogin(
              "info@renatopozzi.me",
              "password"
            );
            const response = await apiCall(
              "GET",
              `/v2/metrics/${seed}/views/${target}?range=${range}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            expect(response.statusCode).toBe(200);
          });
        }
      );

      it("should return 400", async () => {
        const accessToken = await doLogin("info@renatopozzi.me", "password");
        const response = await apiCall(
          "GET",
          `/v2/metrics/${seed}/views/${target}?range=dummy`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        expect(response.statusCode).toBe(400);
      });
    });

    describe("Shared Website", () => {
      const seed = "znz29v2gikf6ni3cytfeapp4t28h69jx";

      it("should return 200", async () => {
        const response = await apiCall(
          "GET",
          `/v2/metrics/${seed}/views/${target}`
        );
        expect(response.statusCode).toBe(200);
      });

      describe.each(["day", "week", "month", "year"])(
        "Different Ranges",
        (range) => {
          it(`should return 200 ${range}`, async () => {
            const response = await apiCall(
              "GET",
              `/v2/metrics/${seed}/views/${target}?range=${range}`
            );

            expect(response.statusCode).toBe(200);
          });
        }
      );
    });
  }
);
