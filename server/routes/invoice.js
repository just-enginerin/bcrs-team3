/**
 * Title: invoice.js
 * Author: Yakut Ahmedin
 * Date: 9/25/2023
 */

"use strict"; // Enable strict mode to catch common coding mistakes

const express = require("express");
const { mongo } = require("../utils/mongo");
const router = express.Router();
const Ajv = require("ajv");
const ajv = new Ajv(); // create new instance of the ajv class

// lineItem schema
const lineItemsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: { type: "number" },
      name: { type: "string" },
      price: { type: "number" },
      quantity: { type: "number" },
      checked: { type: "boolean" },
    },
    required: ["name", "price", "quantity", "checked"],
    additionalProperties: false,
  },
};

// new invoiceSchema
const newInvoiceSchema = {
  type: "object",
  properties: {
    customerFullName: { type: "string" },
    customerEmail: { type: "string" },
    partsAmount: { type: "number" },
    laborAmount: { type: "number" },
    lineItemTotal: { type: "number" },
    invoiceTotal: { type: "number" },
    orderDate: { type: "string" },
    lineItems: lineItemsSchema,
  },
  anyOf: [
    { required: ["partsAmount"] },
    { required: ["laborAmount"] },
    { required: ["lineItems"] },
  ],
  required: [
    "customerFullName",
    "customerEmail",
    "lineItemTotal",
    "invoiceTotal",
    "orderDate",
  ],
  additionalProperties: false,
};

/**
 * getAllInvoices
 */
router.get("/", (req, res, next) => {
  try {
    mongo(async (db) => {
      const invoices = await db
        .collection("invoices")
        .find()
        .sort({ invoiceId: -1 })
        .toArray(); // return as an array

      console.log("invoice", invoices);

      res.send(invoices);
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

/**
 * createInvoices
 */
router.post("/:userId", async (req, res, next) => {
  try {
    const { invoice } = req.body;
    let { userId } = req.params;

    userId = parseInt(userId, 10);
    console.log("invoice", invoice, userId);

    const validator = ajv.compile(newInvoiceSchema);
    const valid = validator(invoice);

    if (!valid) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = validator.errors;
      console.log("req.body validation failed", err);
      next(err);
      return;
    }

    mongo(async (db) => {
      const user = await db.collection("users").findOne({ userId });

      if (!user) {
        const err = new Error("User not found");
        err.status = 404;
        throw err;
      }

      const invoices = await db
        .collection("invoices")
        .find()
        .sort({ invoiceId: -1 }) // sort the records in descending order of invoiceId
        .limit(1) // limit the result to the first record
        .toArray();

      console.log("Invoice Lists", invoices);

      let lastInvoiceId = 100; // Default starting invoiceId if no invoices exist

      if (invoices.length > 0) {
        lastInvoiceId = invoices[0].invoiceId;
      }

      const newInvoiceId = lastInvoiceId + 1;

      const newInvoice = {
        invoiceId: newInvoiceId, // Use the new invoiceId
        userId: user.userId, // User Id who create the invoice
        ...invoice,
      };

      console.log("Invoice to be inserted into MongoDb: ", newInvoice);

      const result = await db.collection("invoices").insertOne(newInvoice);
      console.log("MongoDb result: ", result);
      res.send({ id: result.insertedId, userId, invoiceId: newInvoiceId });
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

/**
 * findPurchasesByService
 */
router.get("/find-purchases-by-service", async (req, res, next) => {
  try {
    // console.log("name", req.params.lineItems.name);
    const name = req.query["lineItems.name"];

    const nameValidation = typeof name;

    if (nameValidation !== "string") {
      const err = new Error("Bad Request");
      err.status = 400;
      err.message = "Invalid name";
      console.log("Invalid name", err);
      next(err);
      return;
    }

    mongo(async (db) => {
      const lineItems = await db
        .collection("invoices")
        .find({ "lineItems.name": name })
        .toArray();

      if (lineItems.length === 0) {
        const err = new Error("Not Found");
        err.status = 404;
        console.log("No line items found with the specified name", err);
        next(err);
        return;
      }

      // Extract just the line items that match the name.
      const matchingLineItems = lineItems.flatMap((invoice) =>
        invoice.lineItems.filter((item) => item.name === name)
      );

      console.log("Matching lineItems", matchingLineItems);

      res.send(matchingLineItems);
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

module.exports = router;
