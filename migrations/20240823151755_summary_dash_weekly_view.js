const { SUMMARY_DASH_WEEKLY_VIEW: TABLE_NAME } = require('../src/tablenames');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.up = async function (knex) {
  return knex.schema.createTable(TABLE_NAME, function (table) {
    table.increments();
    table.integer('client_id').unsigned();
    table.foreign('client_id').references('CLIENTS.id').deferrable('deferred');
    table.date('week');
    table.string('store_name_dashboard');
    table.integer('revenue');
    table.integer('grocer_units');
    table.integer('unit_measurement');
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
