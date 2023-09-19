/**
 * Title: security.js
 * Author: Professor Krasso
 * Date: 9/12/2023
 */

"use strict"; // Enable strict mode

const express = require("express");
const { mongo } = require("../utils/mongo");
const bcrypt = require("bcryptjs");
const Ajv = require("ajv");

const router = express.Router();
const ajv = new Ajv();
const saltRounds = 10;

/**
 * signinSchema
 */
const signinSchema = {
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" },
  },
  required: ["email", "password"],
  additionalProperties: false,
};

/**
 * securityQuestionSchema
 */
const securityQuestionSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      question: { type: "string" },
      answer: { type: "string" },
    },
    required: ["question", "answer"],
    additionalProperties: false,
  },
};

/**
 * registerSchema
 */

/**
 * resetPasswordSchema
 */
const resetPasswordSchema = {
  type: "object",
  properties: {
    password: { type: "string" },
    selectedSecurityQuestion: securityQuestionSchema,
  },
  required: ["password"],
  additionalProperties: false,
};

/**
 * signin
 */
router.post("/signin", (req, res, next) => {
  try {
    const signin = req.body;
    console.log("Sign in object:", signin);

    const validator = ajv.compile(signinSchema);
    const valid = validator(signin);

    if (!valid) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = validator.errors;
      console.log("signin validation errors:", validator.errors);
      next(err);
      return;
    }

    mongo(async (db) => {
      const user = await db
        .collection("users")
        .findOne({ email: signin.email });

      if (!user) {
        const err = new Error("Unauthorized");
        err.status = 401;
        err.message = "Unauthorized: The email or password is invalid.";
        console.log(
          "Unauthorized: The email or password is invalid.",
          signin.email
        );
        next(err);
        return;
      }
      console.log(signin.password, user.password);

      let passwordIsValid = bcrypt.compareSync(signin.password, user.password);

      if (!passwordIsValid) {
        const err = new Error("Unauthorized");
        err.status = 401;
        err.message = "Unauthorized: The email or password is invalid.";
        console.log("Unauthorized: The email or password is invalid.", err);
        next(err);
        return;
      }

      res.send(user);
    }, next);
  } catch (err) {
    console.log("err");
    next(err);
  }
});

/**
 * resetPassword
 */
router.delete("/users/:email/reset-password", (req, res, next) => {
  try {
    const email = req.params.email;
    const newPassword = req.body;

    console.log(`user email: ${email}`);

    const validate = ajv.compile(resetPasswordSchema);
    const valid = validate(newPassword);

    if (!valid) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = validate.errors;
      console.log("password validation errors", validate.errors);
      next(err);
      return;
    }

    mongo(async (db) => {
      const user = await db.collection("users").findOne({ email: email });

      if (!user) {
        const err = new Error("not found");
        err.status = 404;
        console.log(`user not found: ${email}`);
        next(err);
        return;
      }

      console.log(`Selected user: ${user}`);

      const hashedPassword = bcrypt.hashSync(newPassword.password, saltRounds);

      const result = await db.collection("users").updateOne(
        { email: email },
        {
          $set: {
            password: hashedPassword,
          },
        }
      );

      console.log(`mongoDB result: ${result}`);

      res.status(204).send();
    }, next);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
