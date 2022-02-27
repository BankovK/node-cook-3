const request = require('superagent');
const { test } = require('tap');

test('add test', (t) => {
    t.plan(2);

    request
        .post('http://localhost:3000/add/calculate')
        .send('first=1')
        .send('second=2')
        .end((err, res) => {
            console.log('HERE', res.text);
            t.equal(err, null)
            t.ok(/result = 3/ig.test(res.text))
        })
});