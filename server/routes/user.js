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
  },
  required: [
    "firstName",
    "lastName",
    "email",
    "password",
    "isDisabled",
    "role",
  ],
  additionalProperties: false,
};

// update userSchema
const updateUserSchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    phoneNumber: { type: "string" },
    address: { type: "string" },
    language: { type: "string" },
    isDisabled: { type: "boolean" },
    role: { type: "string" },
  },
  required: ["firstName", "lastName", "isDisabled", "role"],
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
        .find()
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

    let { userId } = req.params; // get the userId from the req.params object
    userId = parseInt(userId, 10); // try determine if the userId is a numerical value

    if (isNaN(userId)) {
      const err = new Error("input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }

    mongo(async (db) => {
      const user = await db.collection("users").findOne(
        { userId },
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
            lastSignedIn: 1,
            language: 1,
            selectedSecurityQuestions: 1,
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
      const users = await db
        .collection("users")
        .find()
        .sort({ userId: 1 }) // sort the record in ascending order
        .toArray();

      console.log("User Lists", users);

      const userExists = users.find((use) => use.email === user.email);

      if (userExists) {
        const err = new Error("Bad Request");
        err.satus = 400;
        err.message = "User already exists";
        console.log("User already exists", err);
        next(err);
        return;
      }

      const lastUser = users[users.length - 1];
      const newUserId = lastUser.userId + 1;

      const newUser = {
        userId: newUserId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        isDisabled: user.isDisabled,
        role: user.role,
      };

      console.log("User to be inseted into MongoDb: ", newUser);

      const result = await db.collection("users").insertOne(newUser);
      console.log("MongoDb result: ", result);
      res.send({ id: result.insertedId });
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
    userId = parseInt(userId, 10);

    if (isNaN(userId)) {
      const err = new Error("input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }

    mongo(async (db) => {
      const result = await db.collection("users").deleteOne({ userId: userId });

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
    userId = parseInt(userId, 10);

    if (isNaN(userId)) {
      const err = new Error("input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }
    const { user } = req.body;
    console.log("UserId ", userId, "user data", user);

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

    mongo(async (db) => {
      const result = await db.collection("users").updateOne(
        { userId: userId },
        {
          $set: {
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            language: user.language,
            isDisabled: user.isDisabled,
            role: user.role,
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

/**
 * findSelectedSecurityQuestions
 */
router.get("/:email/security-questions", (req, res, next) => {
  try {
    const email = req.params.email;
    console.log("Email address from req.params", email);

    mongo(async (db) => {
      const user = await db.collection("users").findOne(
        { email: email },
        {
          projection: {
            email: 1,
            userId: 1,
            selectedSecurityQuestions: 1,
          },
        }
      );

      console.log("Selected security questions", user);
      if (!user) {
        const err = new Error("Unable to find user with email ", email);
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }

      res.send(user);
    }, next);
  } catch (error) {
    console.log("err", error);
    next(err);
  }
});

module.exports = router;
