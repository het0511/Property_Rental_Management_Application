const express = require('express');
const Landlord = require('../models/landlord');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = 'het_parikh';

// Create a new landlord (Sign-Up)
router.post('/', async (req, res) => {
  const { name, email, password, mobile_number, address, date_of_birth, type } = req.body;

  console.log('Received data:', req.body); // Log the request body to verify data

  try {
    // Validate landlord or tenant type
    if (!type || (type !== 'Landlord' && type !== 'Tenant')) {
      return res.status(400).send({ error: "Type must be either 'Landlord' or 'Tenant'" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new landlord with hashed password
    const landlord = new Landlord({
      name,
      email,
      password: hashedPassword, // Store the hashed password
      mobile_number,
      address,
      date_of_birth,
      type
    });

    await landlord.save();
    res.status(201).send(landlord);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

// Landlord login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const landlord = await Landlord.findOne({ email });
    if (!landlord) {
      return res.status(400).send({ error: "Invalid email or password" });
    }

    // Compare entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, landlord.password);
    if (!isPasswordValid) {
      return res.status(400).send({ error: "Invalid email or password" });
    }

    // Generate a JWT token if the password is valid
    const token = jwt.sign({ id: landlord._id, type: 'landlord' }, secretKey, { expiresIn: '1h' });
    res.status(200).send({ message: "Login successful", token, userType: 'landlord' });
  } catch (error) {
    res.status(500).send({ error: error.message });
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

// Password change route
router.put('/:id/change-password', async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  //console.log("Received passwords", { oldPassword, newPassword, confirmPassword }); // Add this for logging

  try {
    const landlord = await Landlord.findById(req.params.id);
    if (!landlord) {
      return res.status(404).send({ error: 'Landlord not found' });
    }

    // Check if old password matches the current one
    const isPasswordValid = await bcrypt.compare(oldPassword, landlord.password);
    if (!isPasswordValid) {
      console.log("Old password does not match");
      return res.status(400).send({ error: 'Old password is incorrect' });
    }

    // Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      console.log("Passwords do not match");
      return res.status(400).send({ error: 'New password and confirm password do not match' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update landlord's password
    landlord.password = hashedPassword;
    await landlord.save();

    res.status(200).send({ message: 'Password updated successfully' });
  } catch (error) {
    console.error("Error updating password", error);
    res.status(500).send({ error: error.message });
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
