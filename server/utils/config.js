/**
 * Title: config.js
 * Author: Professor Krasso
 * Date: 9/12/2023
 */

"use strict";

// destructure environment variables
const {
  DB_USERNAME = "bcrs_user",
  DB_PASSWORD = "s3cret",
  DB_NAME = "bcrs",
} = process.env;

// create a config object
const CONFIG = {
  // DB_URL: `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.sloy5er.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
  DB_URL: `mongodb://localhost:27017`,
  DB_NAME: DB_NAME,
};

// export the config object
module.exports = CONFIG;
