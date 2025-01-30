const { MongoClient } = require("mongodb");

let dbConnection;
let uri = "mongodb+srv://nanashifah2:<db_password>@cluster1.cmy6w.mongodb.net/";

const connectToDb = (cb) => {
  MongoClient.connect(uri)
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
