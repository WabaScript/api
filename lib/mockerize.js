const fs = require("fs/promises");
const db = require("./dbInstance");

async function mockerize(fileName) {
  const mock = await fs.readFile(`./mocks/${fileName}`);
  const elements = JSON.parse(mock);
  const [name] = fileName.split(".");

  await db.query(`truncate table ${name}`);

  const promises = elements.map((row) => {
    const columns = Object.keys(row).join(", ");
    const values = Object.values(row);
    const params = values.map((_, i) => `$${i + 1}`);

    return db.query(
      `insert into ${name} (${columns}) values (${params})`,
      values
    );
  });

  await Promise.all(promises);

  return elements;
}

module.exports = { mockerize };
