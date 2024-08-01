var test = require('tape');

test.skip('adding 1 + 1', (t) => {
  t.equal(1 + 1, 2);
  t.end();
});
