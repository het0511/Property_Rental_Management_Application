const express = require('express');
const Maintenance = require('../models/maintenance');
const router = express.Router();

// Create a new maintenance request
router.post('/', async (req, res) => {
  try {
    const maintenance = new Maintenance(req.body);
    await maintenance.save();
    res.status(201).send(maintenance);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all maintenance requests
router.get('/', async (req, res) => {
  try {
    const maintenanceRequests = await Maintenance.find();
    res.status(200).send(maintenanceRequests);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a maintenance request by ID
router.get('/:id', async (req, res) => {
  try {
    const maintenanceRequest = await Maintenance.findById(req.params.id);
    if (!maintenanceRequest) {
      return res.status(404).send();
    }
    res.status(200).send(maintenanceRequest);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a maintenance request by ID
router.put('/:id', async (req, res) => {
  try {
    const maintenanceRequest = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!maintenanceRequest) {
      return res.status(404).send();
    }
    res.status(200).send(maintenanceRequest);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a maintenance request by ID
router.delete('/:id', async (req, res) => {
  try {
    const maintenanceRequest = await Maintenance.findByIdAndDelete(req.params.id);
    if (!maintenanceRequest) {
      return res.status(404).send();
    }
    res.status(200).send(maintenanceRequest);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
