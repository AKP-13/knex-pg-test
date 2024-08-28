const request = require('supertest');
const test = require('tape');
const app = require('../src/app');
const retailers = require('../helpers/retailers');
const weeks = require('../helpers/weeks');

test('API root', async (t) => {
  await request(app)
    .get('/')
    .expect('Content-Type', /text\/html/)
    .expect('Content-Length', '40')
    .expect(200);
  t.end();
});

test('API db now', async (t) => {
  const { body } = await request(app)
    .get('/db')
    .expect('Content-Type', /application\/json/)
    .expect('Content-Length', '34')
    .expect(200);
  console.log(body);
  t.end();
});

test('API user', async (t) => {
  const { body } = await request(app)
    .get('/user')
    .expect('Content-Type', /application\/json/)
    .expect(200);
  // .end(function (err, res) {
  //   if (err) throw err;
  // });
  console.log(body);
  t.end();
});

test('summary-revenue-data', async (t) => {
  const { body } = await request(app)
    .get('/summary-revenue-data')
    .expect('Content-Type', /application\/json/)
    .expect(200);

  t.equal(
    'filteredRev' in body &&
      'filteredUnits' in body &&
      'filteredUnitMeasurement' in body,
    true,
    'Returns filteredRev, filteredUnits and filteredUnitMeasurement keys'
  );

  const actual = body;

  const filteredRev = retailers.map((retailer, retailerIdx) => {
    const data = weeks.map((week) => ({
      x: week,
      y: retailerIdx + 1,
    }));

    return {
      product: retailer,
      data,
    };
  });

  const filteredUnits = retailers.map((retailer, retailerIdx) => {
    const data = weeks.map((week) => ({
      x: week,
      y: retailerIdx + 1,
    }));

    return {
      product: retailer,
      data,
    };
  });

  const filteredUnitMeasurement = retailers.map((retailer, retailerIdx) => {
    const y = (retailerIdx + 1) * (retailerIdx + 1);
    const data = weeks.map((week) => ({
      x: week,
      y,
    }));

    return {
      product: retailer,
      data,
    };
  });

  const expected = {
    filteredRev,
    filteredUnits,
    filteredUnitMeasurement,
  };

  t.deepEqual(actual, expected, 'Correct Total Revenue Data formatting.');

  t.end();
});
