const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Apartment name is required'], 
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  landlord_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Landlord ID is required'],
  },
  rent: {
    type: Number,
    required: [true, 'Rent is required'],
  },
  contract: {
    type: Number,
    required: [true, 'Contract duration is required'],
  },
  date_of_contract: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Occupied', 'Available'], // Status field with only two possible values
    default: 'Available',            // Default status is 'Available'
    required: [true, 'Status is required'],
  },
});

const Apartment = mongoose.model('Apartment', apartmentSchema);

module.exports = Apartment;
