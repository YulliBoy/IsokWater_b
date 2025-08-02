const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  waterRate: {
    type: Number,
    required: true,
    min: 0,
  },
});

module.exports = mongoose.model('User', userSchema);
