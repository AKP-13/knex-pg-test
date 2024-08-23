const express = require('express');
const { Client } = require('pg');
const { USER, SUMMARY_DASH_WEEKLY_VIEW } = require('./tablenames');
require('dotenv').config();
const _ = require('lodash');
const moment = require('moment');

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
} = process.env;

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World! From the knex-pg-test repo!');
});

app.get('/db', async (req, res) => {
  const client = new Client({
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    database: POSTGRES_DB,
  });
  try {
    await client.connect();

    const dbresult = await client.query('SELECT NOW() as now');
    // console.log(dbresult);
    res.json(dbresult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'unexpected error' });
  } finally {
    client.end();
  }
});

app.get('/user', async (req, res) => {
  const client = new Client({
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    database: POSTGRES_DB,
  });
  try {
    await client.connect();

    const dbresult = await client.query(`SELECT * FROM public."${USER}"`);
    // console.log(dbresult);
    res.json({ users: dbresult.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'unexpected error' });
  } finally {
    client.end();
  }
});

app.get('/summary-revenue-data', async (req, res) => {
  const client = new Client({
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    database: POSTGRES_DB,
  });
  try {
    await client.connect();

    // This is the actual query we run for the Total Revenue graph copied from the elm server repo.
    const dbresult = await client.query(`
        WITH get_data AS (
            SELECT
                week AS x,
                s.store_name_dashboard AS product,
                CAST(sum(s.revenue) as float) AS revenue,
                CAST(sum(s.grocer_units) AS float) AS units,
                -- slight tweak here, which I know defeats the purpose of this but did it just to get up and running asap!, is s.unit_measurement
                -- it should be p.unit_measurement where p is product_info but i cba to make a product_info table atm..!
                CAST(sum(s.grocer_units) * MAX(s.unit_measurement) AS float) AS unit_measurement 
            FROM public."${SUMMARY_DASH_WEEKLY_VIEW}" s
            
            ------------------------------- CLIENT ID BELOW MIGHT NEED TO BE CHANGED
            WHERE s.client_id = (13) 
            ------------------------------- CLIENT ID ABOVE MIGHT NEED TO BE CHANGED
            
            GROUP BY 1, product
            ORDER BY 1 DESC
        )
  
      SELECT
        s.x,
        s.product,
        CAST(sum(s.revenue) as float) AS revenue,
        CAST(sum(s.units) AS float) AS units,
        CAST(sum(s.unit_measurement) as float) AS unit_measurement
      FROM get_data s
      GROUP BY 1, product
      ORDER BY 1 DESC
      ;
    `);

    // The logic below is again copied exactly from elm server repo. Ideally this would `literally` be the same code so that we wouldn't have to worry about
    // the code changing and then the test becoming redundant.
    console.log('dbresult', dbresult);

    const groupedByProduct = _(dbresult.rows)
      .groupBy((x) => x.product)
      .value();

    console.log('groupedByProduct', groupedByProduct);

    const groupedRev = _(groupedByProduct)
      .map((value, key) => {
        const dataArray = value.map((item) => ({
          x: moment(item.x).format('YYYY-MM-DD'),
          y: Number(item.revenue),
        }));
        const returnObject = { product: key, data: dataArray };
        return returnObject;
      })
      .value();

    console.log('groupedRev', groupedRev);

    const groupedUnits = _(groupedByProduct)
      .map((value, key) => {
        const dataArray = value.map((item) => ({
          x: moment(item.x).format('YYYY-MM-DD'),
          y: Number(item.units),
        }));
        const returnObject = { product: key, data: dataArray };
        return returnObject;
      })
      .value();

    console.log('groupedUnits', groupedUnits);

    const groupedUnitMeasurement = _(groupedByProduct)
      .map((value, key) => {
        const dataArray = value.map((item) => ({
          x: moment(item.x).format('YYYY-MM-DD'),
          y: Number(item.unit_measurement),
        }));
        const returnObject = { product: key, data: dataArray };
        return returnObject;
      })
      .value();

    console.log('groupedUnitMeasurement', groupedUnitMeasurement);
    /*
      Filter the array to only show the data objects where the data array inside that retailer isnt just an array of empty data like:
      [
        {x: '...', y: 0},
        {x: '...', y: 0},
        {x: '...', y: 0},
        ...
      ]
    */

    const filteredRev = groupedRev.filter((dataObj) =>
      dataObj.data.some((dateObjs) => dateObjs.y !== 0)
    );
    const filteredUnits = groupedUnits.filter((dataObj) =>
      dataObj.data.some((dateObjs) => dateObjs.y !== 0)
    );
    const filteredUnitMeasurement = groupedUnitMeasurement.filter((dataObj) =>
      dataObj.data.some((dateObjs) => dateObjs.y !== 0)
    );

    res.json({ filteredRev, filteredUnits, filteredUnitMeasurement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'unexpected error' });
  } finally {
    client.end();
  }
});

module.exports = app;
