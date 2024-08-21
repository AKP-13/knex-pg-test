const { CLIENTS: TABLE_NAME } = require('../src/tablenames');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(TABLE_NAME).del();
  await knex(TABLE_NAME).insert([
    { store_name: 'elmsample', store_name_dashboard: 'elm sample' },
    { store_name: 'testcompany1', store_name_dashboard: 'Test Company 1' },
    { store_name: 'testcompany2', store_name_dashboard: 'Test Company 2' },
  ]);
};
