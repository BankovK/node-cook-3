const { dns } = require('concordant')();
const redis = require('redis');
const QNAME = 'eventservice';

module.exports = wiring;

function wiring(service) {
  const endpoint = '_main._tcp.redis.micro.svc.cluster.local';
  
  dns.resolve(endpoint, async (err, locs) => {
    if (err) {
      console.log(err);
      return;
    }
    const { port, host } = locs[0];
    const client = redis.createClient(port, host);
    await client.connect();
    pullFromQueue(client);
  })

  function pullFromQueue(client) {
    client.brPop(QNAME, 5, (err, data) => {
      if (err) console.error(err);
      if (err || !data) {
        pullFromQueue(client);
        return;
      }
      const msg = JSON.parse(data[1]);
      const { action, returnPath } = msg;
      const cmd = service[action];
      if (typeof cmd !== 'function') {
        pullFromQueue(client);
        return;
      }
      cmd(msg, (err, result) => {
        if (err) {
          console.error(err);
          pullFromQueue(client);
          return;
        }
        if (!returnPath) {
          pullFromQueue(client);
          return;
        }
        client.lPush(returnPath, JSON.stringify(result), (err) => {
          if (err) console.error(err);
          pullFromQueue(client);
        });
      })
    })
  }
}