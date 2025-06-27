const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  shop: { type: String, required: true },
  location: { type: String, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
