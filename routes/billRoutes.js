const express = require('express');
const router = express.Router();
const Bill = require('../models/Billing');
const Customer = require('../models/Customer');
const User = require('../models/User'); // ✅ Import User model

// API: GET /api/bills/:id
router.get('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      console.error("Bill not found for ID:", req.params.id);
      return res.status(404).send("Bill not found");
    }

    let customer = null;
    if (bill.customerId) {
      customer = await Customer.findById(bill.customerId);
    }

    let user = null;
    if (bill.userId) {
      user = await User.findById(bill.userId).select('-password'); // exclude password
    }

    // Final Response: Merges all three pieces of info
    res.json({
      ...bill._doc,
      customer,
      user
    });

  } catch (err) {
    console.error("Error in /api/bills/:id", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
