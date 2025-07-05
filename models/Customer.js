const mongoose = require('mongoose');

const EyePrescriptionSchema = new mongoose.Schema({
  right: {
    sph: String,
    cyl: String,
    axis: String,
    add: String
  },
  left: {
    sph: String,
    cyl: String,
    axis: String,
    add: String
  },
  pd: String,
  notes: String
}, { _id: false });

const CustomerSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  address: String,
  eyePrescription: EyePrescriptionSchema,
  visits: [{
    date: Date,
    notes: String,
    billId: String
  }],
  bills: [{
    date: Date,
    items: [{ name: String, price: Number }],
    total: Number,
    discount: Number,
    paid: Number
  }],
  profilePhoto: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', CustomerSchema);
