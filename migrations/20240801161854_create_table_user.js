const { USER: TABLE_NAME } = require('../src/tablenames');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.up = async function (knex) {
  return knex.schema.createTable(TABLE_NAME, function (table) {
    table.increments();
    table.string('name');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.down = async function (knex) {
  return knex.schema.dropTableIfExists(TABLE_NAME);
};
