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
const { ObjectId } = require("mongodb");

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

// update userSchema
const updateUserSchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    password: { type: "string" },
    phoneNumber: { type: "string" },
    address: { type: "string" },
    isDisabled: { type: "boolean" },
    role: { type: "string" },
    language: { type: "string" },
    selectedSecurityQuestions: selectedSecurityQuestionsSchema,
  },
  required: [
    "firstName",
    "lastName",
    "password",
    "phoneNumber",
    "address",
    "isDisabled",
    "language",
    "role",
    "selectedSecurityQuestions",
  ],
  additionalProperties: false,
};


// new userSchema
const newUserSchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    phoneNumber: { type: "string" },
    address: { type: "string" },
    isDisabled: { type: "boolean" },
    role: { type: "string" },
    language: { type: "string" },
    selectedSecurityQuestions: selectedSecurityQuestionsSchema,
  },
  required: [
    "firstName",
    "lastName",
    "email",
    "password",
    "isDisabled",
    "role"
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
              password: 1,
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

    // Check if userId is a valid ObjectId
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid ObjectId" });
    }

    mongo(async (db) => {
      const user = await db.collection("users").findOne(
        { _id: new ObjectId(userId), isDisabled: false },
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

/**
 * createUser
 */
router.post("/", (req, res, next) => {
  try {
    const { user } = req.body;
    console.log("user", user);

    const validator = ajv.compile(newUserSchema);
    const valid = validator(user);

    if (!valid) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = validator.errors;
      console.log("req.body validation failed", err);
      next(err);
      return;
    }

    user.password = bcrypt.hashSync(user.password, saltRounds);

    // Set the lastSignedIn field to the current date and time
    user.lastSignedIn = new Date().toISOString();

    mongo(async (db) => {
      const result = await db.collection("users").insertOne(user);

      console.log("result", result);

      res.json({ id: result.insertedId });
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

/**
 * deleteUser
 */
router.delete("/:userId", (req, res, next) => {
  try {
    let { userId } = req.params;

    // Check if userId is a valid ObjectId
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid ObjectId" });
    }

    mongo(async (db) => {
      const result = await db
        .collection("users")
        .deleteOne({ _id: new ObjectId(userId) });

      console.log("result", result);

      if (result.deletedCount !== 1) {
        const err = new Error("Not Found");
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }

      res.status(204).send();
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

/**
 * updateUser
 */
router.put("/:userId", (req, res, next) => {
  try {
    let { userId } = req.params;

    // Check if userId is a valid ObjectId
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid ObjectId" });
    }
    const { user } = req.body;

    const validator = ajv.compile(updateUserSchema);
    const valid = validator(user);

    if (!valid) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = validator.errors;
      console.log("updatedUserSchema validation failed", err);
      next(err);
      return;
    }

    user.password = bcrypt.hashSync(user.password, saltRounds);

    mongo(async (db) => {
      const result = await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            firstName: user.firstName,
            lastName: user.lastName,
            password: user.password,
            phoneNumber: user.phoneNumber,
            address: user.address,
            language: user.language,
            isDisabled: user.isDisabled,
            role: user.role,
            "selectedSecurityQuestions.0.questionText":
              user.selectedSecurityQuestions[0].questionText,
            "selectedSecurityQuestions.0.answerText":
              user.selectedSecurityQuestions[0].answerText,
            "selectedSecurityQuestions.1.questionText":
              user.selectedSecurityQuestions[1].questionText,
            "selectedSecurityQuestions.1.answerText":
              user.selectedSecurityQuestions[1].answerText,
          },
        }
      );

      console.log("update user result: ", result);

      if (result.modifiedCount === 0) {
        const err = new Error("User not found");
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }

      res.status(201).send(user);
    });
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});
module.exports = router;
