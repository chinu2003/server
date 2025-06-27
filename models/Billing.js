const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  userId: String,
  customerId: String,
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
      total: Number
    }
  ],
  totalAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Bill", billSchema);
