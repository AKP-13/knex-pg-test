const request = require('supertest');
const test = require('tape');
const app = require('../src/app');

test('API root', async (t) => {
  await request(app)
    .get('/')
    .expect('Content-Type', /text\/html/)
    .expect('Content-Length', '12')
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
