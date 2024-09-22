const mongoose = require('mongoose');

const landlordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  mobile_number: {
    type: String,
    required: [true, 'Mobile number is required'],
  },
  date_of_birth: {
    type: Date,
    required: [true, 'Date of birth is required'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^.+@.+\..+$/, 'Please enter a valid email address'],
  },
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

const Landlord = mongoose.model('Landlord', landlordSchema);

module.exports = Landlord;
