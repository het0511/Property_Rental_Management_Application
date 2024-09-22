const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
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
    required: [true, 'Date of contract is required'],
  },
});

const Apartment = mongoose.model('Apartment', apartmentSchema);

module.exports = Apartment;
