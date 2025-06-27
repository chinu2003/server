const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  brand: String,
  modelCode: String,
  color: String,
  size: String,
  quantity: Number,
  costPrice: Number,
  sellingPrice: Number,
  gstPercent: Number,
  minStockAlert: Number,
  userId: {
    type: String,
    required: true  // 👈 this is important
  }
});

module.exports = mongoose.model('Product', productSchema);
