const express = require('express');
const Apartment = require('../models/apartment');
const router = express.Router();

// Create a new apartment
router.post('/', async (req, res) => {
  try {
    const apartment = new Apartment(req.body);
    await apartment.save();
    res.status(201).send(apartment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all apartments
router.get('/', async (req, res) => {
  try {
    const apartments = await Apartment.find();
    res.status(200).send(apartments);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get an apartment by ID
router.get('/:id', async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) {
      return res.status(404).send();
    }
    res.status(200).send(apartment);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an apartment by ID
router.put('/:id', async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!apartment) {
      return res.status(404).send();
    }
    res.status(200).send(apartment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an apartment by ID
router.delete('/:id', async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndDelete(req.params.id);
    if (!apartment) {
      return res.status(404).send();
    }
    res.status(200).send(apartment);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
