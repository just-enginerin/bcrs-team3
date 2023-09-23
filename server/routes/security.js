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
const securityQuestionsSchema = {
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
const registerSchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    phoneNumber: { type: "string" },
    address: { type: "string" },
    language: { type: "string" },
    selectedSecurityQuestions: securityQuestionsSchema,
  },
  required: [
    "firstName",
    "lastName",
    "email",
    "password",
    "selectedSecurityQuestions",
  ],
  additionalProperties: false,
};

/**
 * resetPasswordSchema
 */
const resetPasswordSchema = {
  type: "object",
  properties: {
    password: { type: "string" },
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
 * registerUser
 */
router.post("/register", (req, res, next) => {
  try {
    const { user } = req.body;
    console.log("user", user);

    const validate = ajv.compile(registerSchema);
    const valid = validate(user);

    if (!valid) {
      const err = new Error("Bad Request");
      err.satus = 400;
      err.error = validate.errors;
      console.log("user validation errors", validate.errors);
      next(err);
      return;
    }

    user.password = bcrypt.hashSync(user.password, saltRounds);

    mongo(async (db) => {
      const users = await db
        .collection("users")
        .find()
        .sort({ userId: 1 }) // sort the record in ascending order
        .toArray();

      console.log("User Lists:", users);

      const userExists = users.find((user) => user.email === users.email);
      // Set the lastSignedIn field to the current date and time
      user.lastSignedIn = new Date().toISOString();

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
        phoneNumber: user.phoneNumber,
        address: user.address,
        language: user.language,
        lastSignedIn: user.lastSignedIn,
        role: "standard",
        // selectedSecurityQuestions: user.selectedSecurityQuestions,
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
 * verifyUser
 */
router.post("/verify/users/:email", (req, res, next) => {
  try {
    const email = req.params.email;
    console.log("Email user", email);

    mongo(async (db) => {
      const user = await db.collection("users").findOne({ email: email });

      if (!user) {
        const err = new Error("Not Found");
        err.satus = 404;
        console.log("User not found", err);
        next(err);
        return;
      }
      console.log("Selected user", user);

      res.send(user);
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

/**
 * verify security questions
 */
router.post("/verify/users/:email/security-questions", (req, res, next) => {
  try {
    const email = req.params.email;
    const { securityQuestions } = req.body;

    console.log(`Email:${email}\nSecurity Questions: ${securityQuestions}`);

    const validate = ajv.compile(securityQuestionsSchema);
    const valid = validate(securityQuestions);

    if (!valid) {
      const err = new Error("Bad Request");
      err.satus = 400;
      err.error = validate.errors;
      console.log("security question validation errors", validate.errors);
      next(err);
      return;
    }

    mongo(async (db) => {
      const user = await db.collection("users").findOne({ email: email });

      if (!user) {
        const err = new Error("Not Found");
        err.satus = 404;
        console.log("User not found", err);
        next(err);
        return;
      }
      console.log("Selected user", user);

      if (
        securityQuestions[0].answer !==
          user.selectedSecurityQuestions[0].answer ||
        securityQuestions[1].answer !==
          user.selectedSecurityQuestions[1].answer ||
        securityQuestions[2].answer !== user.selectedSecurityQuestions[2].answer
      ) {
        const err = new Error("Unautorized");
        err.status = 401;
        err.message = "Unautorized: Security questions do not match";
        console.log("Unautorized: Security questions do not match", err);
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
