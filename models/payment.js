const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: [true, 'Tenant ID is required'],
  },
  landlord_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Landlord',
    required: [true, 'Landlord ID is required'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid'],
    required: [true, "Status is required and must be either 'Pending' or 'Paid'"],
  },
  date_of_payment: {
    type: Date,
    required: [true, 'Date of payment is required'],
  },
  time_period: {
    type: String,
    required: [true, 'Time period is required'],
    description: "Time period for which the rent has been paid (e.g., '1 month', '6 months')",
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
