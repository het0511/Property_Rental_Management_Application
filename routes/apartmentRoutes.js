const express = require('express');
const Apartment = require('../models/apartment');
const jwt = require('jsonwebtoken');
const secretKey = 'het_parikh';  
const router = express.Router();

// Middleware to authenticate landlord
const authenticateLandlord = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log('Decoded ID:', decoded.id);
    req.landlordId = decoded.id; // Store landlord ID in the request
    next();
  } catch (error) {
    return res.status(401).send('Invalid token.');
  }
};

// Fetch apartments for the logged-in landlord
router.get('/', authenticateLandlord, async (req, res) => {
  try {
    // Find apartments by landlord ID from the token
    const apartments = await Apartment.find({ landlord_id: req.landlordId });
    console.log('Landlord ID:', req.landlordId);
    res.status(200).send(apartments);
  } catch (error) {
    res.status(500).send({ error: 'Unable to fetch apartments' });
  }
});

// Create a new apartment (Landlord Only)
router.post('/', authenticateLandlord, async (req, res) => {
  const { name, address, rent, contract, date_of_contract, status } = req.body;
  
  try {
    const newApartment = new Apartment({
      name,  // Include apartment name
      address,
      landlord_id: req.landlordId,  // Assign landlord ID from token
      rent,
      contract,
      date_of_contract,
      status: status || 'Available',  // Default to 'Available' if no status is provided
    });

    await newApartment.save();
    res.status(201).send(newApartment);
  } catch (error) {
    res.status(400).send({ error: 'Unable to create apartment' });
  }
});

// Update an apartment (Landlord Only)
router.put('/:id', authenticateLandlord, async (req, res) => {
  try {
    const apartment = await Apartment.findOneAndUpdate(
      { _id: req.params.id, landlord_id: req.landlordId },  // Ensure landlord is the owner
      req.body,  // The entire req.body will include name, status, and other fields
      { new: true, runValidators: true }
    );

    if (!apartment) {
      return res.status(404).send({ error: 'Apartment not found or unauthorized' });
    }

    res.status(200).send(apartment);
  } catch (error) {
    res.status(400).send({ error: 'Unable to update apartment' });
  }
});

// Delete an apartment (Landlord Only)
router.delete('/:id', authenticateLandlord, async (req, res) => {
  try {
    const apartment = await Apartment.findOneAndDelete({
      _id: req.params.id,
      landlord_id: req.landlordId,  // Ensure landlord is the owner
    });

    if (!apartment) {
      return res.status(404).send({ error: 'Apartment not found or unauthorized' });
    }

    res.status(200).send({ message: 'Apartment deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Unable to delete apartment' });
  }
});

// GET request to fetch a specific apartment by ID
router.get('/:id', authenticateLandlord, async (req, res) => {
  try {
    const apartment = await Apartment.findOne({
      _id: req.params.id,
      landlord_id: req.landlordId, // Ensure this is set correctly to the authenticated landlord's ID
    });

    if (!apartment) {
      return res.status(404).send({ error: 'Apartment not found' });
    }

    res.status(200).send(apartment);
  } catch (error) {
    console.error('Error fetching apartment:', error);
    res.status(500).send({ error: 'Unable to fetch apartment' });
  }
});

module.exports = router;
