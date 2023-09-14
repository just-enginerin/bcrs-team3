/**
 * Title: mongo.js
 * Author: Professor Krasso
 * Date: 9/12/2023
 */

"use strict";

const { MongoClient } = require("mongodb");
const config = require("./config");

const MONGO_URL = config.DB_URL;

const mongo = async (operations, next) => {
  try {
    console.log("Connecting to MongoDB...");

    // log the connection string
    console.log("MONGO_URL: ", MONGO_URL);
    console.log("DB_NAME: ", config.DB_NAME);

    // connect to MongoDB cluster
    const client = await MongoClient.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // select the database
    const db = client.db(config.DB_NAME);
    console.log("Connected to MongoDB Atlas");

    // execute the operations
    await operations(db);
    console.log("Operations executed successfully");

    // close the connection to the database
    client.close();
    console.log("Connection to MongoDB closed\n");
  } catch (err) {
    // record an error to report later
    const error = new Error(
      `An error occurred while connecting to MongoDB ${err.message}}`
    );

    // set the status to 500 (server error)
    error.status = 500;

    // logs details of the errors to the console
    console.log("An error occurred while connecting to MongoDB", err);
    next(error);
  }
};

module.exports = { mongo };
