const { USER: TABLE_NAME } = require('../src/tablenames');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(TABLE_NAME).del();
  await knex(TABLE_NAME).insert([
    { name: 'John' },
    { name: 'Joanna' },
    { name: 'Jennifer' },
  ]);
};
