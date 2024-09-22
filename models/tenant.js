const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tenant name is required'],
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
  apartment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apartment',
    required: [true, 'Apartment ID is required'],
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

const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;
