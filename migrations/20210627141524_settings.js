exports.up = function (knex) {
  return knex.schema.createTable("settings", function (table) {
    table.increments("id");
    table.string("key", 255).unique().notNullable();
    table.string("value", 255).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("settings");
};
