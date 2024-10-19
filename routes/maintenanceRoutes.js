const express = require('express');
const Maintenance = require('../models/maintenance');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to get tenant ID from token
const getTenantIdFromToken = (req) => {
  const token = req.headers['authorization']?.split(' ')[1]; 
  if (!token) {
    throw new Error('Authentication token is required');
  }
  const decoded = jwt.verify(token, 'het_parikh'); 
  return decoded.id; 
};

// Middleware to get landlord ID from token
const getLandlordIdFromToken = (req) => {
  const token = req.headers['authorization']?.split(' ')[1]; 
  if (!token) {
    throw new Error('Authentication token is required');
  }
  const decoded = jwt.verify(token, 'het_parikh'); 
  console.log('Decoded Token:', decoded);
  return decoded.id; 
};

// Create a new maintenance request
router.post('/', async (req, res) => {
  try {
    const tenantId = getTenantIdFromToken(req); // Extract tenant ID from the token
    const { landlord_id, request_type } = req.body; // Destructure the required fields from the request body

    // Create a new maintenance request object
    const maintenance = new Maintenance({
      tenant_id: tenantId, // Use the tenant ID from the token
      landlord_id, // Use landlord ID from the request body
      request_type, // Use request type from the request body
      status: 'Pending', // Set initial status to 'Pending'
      date_of_request: new Date(), // Set current date and time
    });
    
    // Save the maintenance request to the database
    await maintenance.save();
    
    // Respond with the created maintenance request
    res.status(201).send(maintenance);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error creating maintenance request:', error);
    res.status(400).send({ error: error.message }); // Send error message
  }
});

// Get all maintenance requests for the tenant
router.get('/', async (req, res) => {
  try {
    const tenantId = getTenantIdFromToken(req);
    const maintenanceRequests = await Maintenance.find({ tenant_id: tenantId });
    res.status(200).send(maintenanceRequests);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get a maintenance request by ID
router.get('/:id', async (req, res) => {
  try {
    const maintenanceRequest = await Maintenance.findById(req.params.id);
    if (!maintenanceRequest) {
      return res.status(404).send({ error: 'Maintenance request not found' });
    }
    res.status(200).send(maintenanceRequest);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get all maintenance requests for the landlord
router.get('/landlord', async (req, res) => {
  try {
    const landlordId = getLandlordIdFromToken(req);
    const maintenanceRequests = await Maintenance.find({ landlord_id: landlordId });
    res.status(200).send(maintenanceRequests);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update a maintenance request by ID (only request_type can be updated)
router.put('/:id', async (req, res) => {
  try {
    const { request_type } = req.body; // Only allow updating request_type
    const maintenanceRequest = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { request_type },
      { new: true, runValidators: true }
    );
    if (!maintenanceRequest) {
      return res.status(404).send({ error: 'Maintenance request not found' });
    }
    res.status(200).send(maintenanceRequest);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Update the status of a maintenance request by ID
router.put('/landlord/:id/status', async (req, res) => {
  try {
    const { status } = req.body; // Get the new status from the request body
    const maintenanceRequest = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { status }, // Update the status
      { new: true, runValidators: true }
    );
    if (!maintenanceRequest) {
      return res.status(404).send({ error: 'Maintenance request not found' });
    }
    res.status(200).send(maintenanceRequest);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete a maintenance request by ID
router.delete('/:id', async (req, res) => {
  try {
    const maintenanceRequest = await Maintenance.findByIdAndDelete(req.params.id);
    if (!maintenanceRequest) {
      return res.status(404).send({ error: 'Maintenance request not found' });
    }
    res.status(200).send(maintenanceRequest);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
