const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  type: {
    type: String,
    enum: ['Tenant', 'Landlord'],
    required: [true, "Type is required and must be either 'Tenant' or 'Landlord'"],
  },
});

const UserDetails = mongoose.model('UserDetails', userDetailsSchema);

module.exports = UserDetails;
