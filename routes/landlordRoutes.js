const express = require('express');
const Landlord = require('../models/landlord');
const router = express.Router();

// Create a new landlord
router.post('/', async (req, res) => {
  const { name, email, password, mobile_number, address, date_of_birth, type } = req.body;

  console.log('Received data:', req.body); // Log the request body to verify data

  try {
    if (!type || (type !== 'Landlord' && type !== 'Tenant')) {
      return res.status(400).send({ error: "Type must be either 'Landlord' or 'Tenant'" });
    }
    
    const landlord = new Landlord({ name, email, password, mobile_number, address, date_of_birth, type });
    await landlord.save();
    res.status(201).send(landlord);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

// Get all landlords
router.get('/', async (req, res) => {
  try {
    const landlords = await Landlord.find();
    res.status(200).send(landlords);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Login a landlord
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const landlord = await Landlord.findOne({ email });
    if (!landlord || landlord.password !== password) {
      return res.status(400).send({ error: "Invalid email or password" });
    }
    res.status(200).send({ message: "Login successful", landlord });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get a landlord by ID
router.get('/:id', async (req, res) => {
  try {
    const landlord = await Landlord.findById(req.params.id);
    if (!landlord) {
      return res.status(404).send({ error: 'Landlord not found' });
    }
    res.status(200).send(landlord);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update a landlord by ID
router.put('/:id', async (req, res) => {
  try {
    const landlord = await Landlord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!landlord) {
      return res.status(404).send({ error: 'Landlord not found' });
    }
    res.status(200).send(landlord);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete a landlord by ID
router.delete('/:id', async (req, res) => {
  try {
    const landlord = await Landlord.findByIdAndDelete(req.params.id);
    if (!landlord) {
      return res.status(404).send({ error: 'Landlord not found' });
    }
    res.status(200).send({ message: 'Landlord deleted successfully', landlord });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
