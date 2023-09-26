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
      name: { type: "string" },
      price: { type: "number" },
    },
    required: ["name", "price"],
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
    lineItems: lineItemsSchema,
  },
  required: [
    "customerFullName",
    "customerEmail",
    "partsAmount",
    "laborAmount",
    "lineItems",
  ],
  additionalProperties: false,
};

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

    // Calculate lineItemTotal by summing up the prices of line items
    const lineItemTotal = invoice.lineItems.reduce(
      (total, item) => total + item.price,
      0
    );

    // Calculate invoiceTotal by adding partsAmount, laborAmount, and lineItemTotal
    const invoiceTotal =
      invoice.partsAmount + invoice.laborAmount + lineItemTotal;

    // Get the current date and time as the orderDate
    const orderDate = new Date();

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
        userId: user.userId, // User Id who creates the invoice
        orderDate, // Add orderDate
        lineItemTotal, // Add lineItemTotal
        invoiceTotal, // Add invoiceTotal
        ...invoice,
      };

      console.log("Invoice to be inserted into MongoDb: ", newInvoice);

      const result = await db.collection("invoices").insertOne(newInvoice);
      console.log("MongoDb result: ", result);
      res.send({ newInvoice });
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});


module.exports = router;
