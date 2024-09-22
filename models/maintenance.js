const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  landlord_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Landlord',
    required: [true, 'Landlord ID is required'],
  },
  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: [true, 'Tenant ID is required'],
  },
  request_type: {
    type: String,
    required: [true, 'Request type is required'],
    description: "A string describing the service needed",
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Completed'],
    required: [true, "Status is required and must be either 'Pending', 'Approved', or 'Completed'"],
  },
  date_of_request: {
    type: Date,
    required: [true, 'Date of request is required'],
  },
});

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

module.exports = Maintenance;
