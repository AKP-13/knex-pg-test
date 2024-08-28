const retailers = require('../helpers/retailers');
const weeks = require('../helpers/weeks');
const { SUMMARY_DASH_WEEKLY_VIEW: TABLE_NAME } = require('../src/tablenames');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
module.exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(TABLE_NAME).del();

  const dataToReturn = retailers.flatMap((retailer, retailerIdx) =>
    weeks.flatMap((week) => ({
      week,
      client_id: 13,
      store_name_dashboard: retailer,
      revenue: retailerIdx + 1,
      grocer_units: retailerIdx + 1,
      unit_measurement: retailerIdx + 1,
    }))
  );

  await knex(TABLE_NAME).insert(dataToReturn);
};
