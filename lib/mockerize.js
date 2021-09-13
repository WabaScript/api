const fs = require("fs/promises");
const db = require("./dbInstance");

async function truncate(table) {
  return db.query(`truncate table ${table} restart identity`);
}

async function mockerize(fileName) {
  const mock = await fs.readFile(`./mocks/${fileName}.json`);
  const elements = JSON.parse(mock);
  const name = fileName;

  await truncate(name);

  const promises = elements.map((row) => {
    const columns = Object.keys(row).join(", ");
    const values = Object.values(row);
    const params = values.map((_, i) => `$${i + 1}`);

    return db.query(
      `insert into ${name} (${columns}) values (${params}) returning *`,
      values
    );
  });

  const inserted = await (await Promise.all(promises)).map((el) => el.rows[0]);

  return inserted;
}

module.exports = { mockerize, truncate };
