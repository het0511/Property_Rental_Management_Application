const express = require('express');
const Tenant = require('../models/tenant');
const router = express.Router();

// Create a new tenant
router.post('/', async (req, res) => {
  try {
    const tenant = new Tenant(req.body);
    await tenant.save();
    res.status(201).send(tenant);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all tenants
router.get('/', async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.status(200).send(tenants);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a tenant by ID
router.get('/:id', async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).send();
    }
    res.status(200).send(tenant);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a tenant by ID
router.put('/:id', async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tenant) {
      return res.status(404).send();
    }
    res.status(200).send(tenant);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a tenant by ID
router.delete('/:id', async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) {
      return res.status(404).send();
    }
    res.status(200).send(tenant);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
