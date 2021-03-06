const { MongoClient } = require('mongodb');
const { dns } = require('concordant')();

// Pre-DNS:
// ------------------------------
// const {
//   MONGO_SERVICE_HOST,
//   MONGO_SERVICE_PORT
// } = process.env;
// const url = `mongodb://${MONGO_SERVICE_HOST}:${MONGO_SERVICE_PORT}/audit`;

// module.exports = service;

// function service() {
//   function append(args, cb) {
//     MongoClient.connect(url, (err, db) => {
//       if (err) {
//         cb(err);
//         return;
//       }
//       const audit = db.collection('audit');
//       const data = {
//         ts: Date.now(),
//         calc: args.calc,
//         result: args.calcResult
//       };

//       audit.insert(data, (err, result) => {
//         if (err) {
//           cb(err);
//           return;
//         }
//         cb(null, {result: result.toString()});
//         db.close();
//       })
//     })
//   }

//   function list(args, cb) {
//     MongoClient.connect(url, (err, db) => {
//       if (err) {
//         cb(err);
//         return;
//       }
//       const audit = db.collection('audit');
//       audit.find({}, {limit: 10}).toArray((err, docs) => {
//         if (err) {
//           cb(err);
//           return;
//         }
//         cb(null, {list: docs});
//         db.close();
//       })
//     })
//   }

//   return { append, list };
// }
// ------------------------------

module.exports = service;

function service() {
  var db;

  setup();

  function setup() {
    const mongo = '_main._tcp.mongo.micro.svc.cluster.local';

    dns.resolve(mongo, (err, locs) => {
      if (err) {
        console.error(err);
        return;
      }
      const { host, port } = locs[0];
      const url = `mongodb://${host}:${port}/audit`;
      MongoClient.connect(url, (err, client) => {
        if (err) {
          console.log('failed to connect to MongoDB retrying in 100ms');
          setTimeout(setup, 100);
          return;
        }
        db = client;
        db.on('close', () => db = null);
      });
    });
  }

  function append(args, cb) {
    if (!db) {
      cb(Error('No database connection'));
      return;
    }
    const audit = db.collection('audit');
    const data = {
      ts: Date.now(),
      calc: args.calc,
      result: args.calcResult
    };

    audit.insert(data, (err, result) => {
      if (err) {
        cb(err);
        return;
      }
      cb(null, {result: result.toString()});
    })
  }
  
  function list(args, cb) {
    if (!db) {
      cb(Error('No database connection'));
      return;
    }
    const audit = db.collection('audit');
    audit.find({}, {limit: 10}).toArray((err, docs) => {
      if (err) {
        cb(err);
        return;
      }
      cb(null, {list: docs});
    })
  }

  return { append, list };
}
