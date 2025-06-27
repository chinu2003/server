// routes/visitRoutes.js
const express = require('express');
const router = express.Router();
const Bill = require('../models/Billing');
const Customer = require('../models/Customer');

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const bills = await Bill.find({ userId }).sort({ createdAt: -1 });

    const results = await Promise.all(bills.map(async (bill) => {
      const customer = await Customer.findById(bill.customerId);
      return {
        ...bill._doc,
        customer
      };
    }));

    res.json(results);
  } catch (err) {
    console.error('Error loading visits', err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
