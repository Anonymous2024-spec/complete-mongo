const { MongoClient } = require("mongodb");

let dbConnection;

const connectToDb = (cb) => {
  MongoClient.connect("mongodb://localhost:27017/bookstore")
    .then((client) => {
      dbConnection = client.db();
      return cb(null);
    })
    .catch((err) => {
      console.log(err);
      return cb(err);
    });
};

const getDb = () => dbConnection;

module.exports = { connectToDb, getDb };
