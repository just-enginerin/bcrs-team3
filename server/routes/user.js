/**
 * Title: user.js
 * Author: Professor Krasso
 * Date: 9/12/2023
 */

"use strict"; // Enable strict mode to catch common coding mistakes

const express = require("express");
const { mongo } = require("../utils/mongo");
const router = express.Router();
const Ajv = require("ajv");
const bcrypt = require("bcryptjs");

const saltRounds = 10;
const ajv = new Ajv(); // create new instance of the ajv class

// selected Security QuestionsSchema schema
const selectedSecurityQuestionsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      questionText: { type: "string" },
      answerText: { type: "string" },
    },
    required: ["questionText", "answerText"],
    additionalProperties: false,
  },
  minItems: 2,
  maxItems: 2,
};

// user Schema
const userSchema = {
  type: "object",
  properties: {
    userId: { type: "number" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    phoneNumber: { type: "string" },
    address: { type: "string" },
    role: { type: "string" },
    isDisabled: { type: "boolean" },
    language: { type: "string" },
    lastSignedIn: { type: "string" },
    selectedSecurityQuestions: selectedSecurityQuestionsSchema,
  },
  required: [
    "userId",
    "firstName",
    "lastName",
    "email",
    "password",
    "phoneNumber",
    "address",
    "role",
    "isDisabled",
    "language",
    "selectedSecurityQuestions",
  ],
  additionalProperties: false,
};



/**
 * getAllUsers
 */
router.get("/", (req, res, next) => {
  try {
    mongo(async (db) => {
      const users = await db
        .collection("users")
        .find(
          { isDisabled: false },
          {
            projection: {
              userId: 1,
              firstName: 1,
              lastName: 1,
              email: 1,
              phoneNumber: 1,
              address: 1,
              isDisabled: 1,
              role: 1,
            },
          }
        )
        .sort({ userId: 1 })
        .toArray(); // return as an array

      console.log("user", users);

      res.send(users);
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

/**
 * findUserById
 */
router.get("/:userId", (req, res, next) => {
  try {
    console.log("userId", req.params.userId);

    let { userId } = req.params; // get the userId
    userId = parseInt(userId, 10); // cheack the userId is a number

    if (isNaN(userId)) {
      const err = new Error("input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }

    mongo(async (db) => {
      const user = await db.collection("users").findOne(
        { userId, isDisabled: false },
        {
          projection: {
            userId: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            phoneNumber: 1,
            address: 1,
            isDisabled: 1,
            role: 1,
          },
        }
      ); // find user by ID

      if (!user) {
        const err = new Error("Unable to find user with userId " + userId);
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }

      res.send(user);
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

module.exports = router;
