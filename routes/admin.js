const { dbInstance } = require("../lib/dbInstance");

const admin = (fastify, _, done) => {
  fastify.get("/websites", async () => {
    const { rows } = await dbInstance.query("SELECT * FROM websites");

    return rows;
  });

  done();
};

module.exports = { admin };
