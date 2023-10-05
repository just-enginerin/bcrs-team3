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
const ajv = new Ajv(); // create new instance of the ajv class

// new userSchema
const newUserSchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    isDisabled: { type: "boolean" },
    role: { type: "string" },
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
    phoneNumber: { type: ["string", "null"] },
    address: { type: ["string", "null"] },
    language: { type: ["string", "null"] },
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
        err.status = 400;
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

      console.log("User to be inserted into MongoDb: ", newUser);

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
 * deleteUser set “isDisabled” to true
 */
router.delete("/:userId", (req, res, next) => {
  try {
    const { userId } = req.params;
    const parsedUserId = parseInt(userId, 10);

    if (isNaN(parsedUserId)) {
      const err = new Error("Input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }

    console.log("che", userId, parsedUserId);
    mongo(async (db) => {
      // Prevent delete if there's only one admin
      const adminCount = await db
        .collection("users")
        .countDocuments({ role: "admin" });
      const adminRole = await db
        .collection("users")
        .findOne({ userId: parsedUserId });

      console.log("adminCount,", adminCount, adminRole.role);

     // Check if the user to be deleted is an admin
     if (adminRole && adminRole.role === "admin") {
      if (adminCount === 1) {
        const err = new Error("Cannot change the status of last admin user");
        err.status = 400;
        console.log("err", err);
        next(err);
        return;
      }
    }

      const result = await db.collection("users").updateOne(
        { userId: parsedUserId },
        { $set: { isDisabled: true } } // Set isDisabled to true
      );

      console.log("result", result);

      if (result.matchedCount !== 1) {
        const err = new Error("User not found");
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }

      res.status(200).json({ message: "User is disabled" });
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
      // Prevent update role and status if there's only one admin
      const adminCount = await db
        .collection("users")
        .countDocuments({ role: "admin" });
      const adminRole = await db
        .collection("users")
        .findOne({ userId: userId });

      console.log("adminCount,", adminCount, "adminRole", adminRole.role);

      if (adminCount === 1 && adminRole.role === "admin") {
        if (user.role !== "admin" || user.isDisabled === true) {
          const err = new Error(
            "Cannot change the role or status of the last admin user"
          );
          err.status = 400;
          console.log("err", err);
          next(err);
          return;
        }
      }
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
        const err = new Error(
          "Bad request: No changes were made to this user."
        );
        err.status = 400;
        console.log("err", err);
        next(err);
        return;
      }

      res.status(201).send(result);
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
