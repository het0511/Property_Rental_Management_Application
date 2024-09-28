const express = require('express');
const Tenant = require('../models/tenant');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const router = express.Router();
const SECRET_KEY = 'het_parikh'; // Replace with your actual secret key

// Login a tenant
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const tenant = await Tenant.findOne({ email });
    if (!tenant || !(await tenant.matchPassword(password))) { // Assuming you have a method to check passwords
      return res.status(401).send({ error: 'Invalid email or password' });
    }

    // Create a token
    const token = jwt.sign({ id: tenant._id }, SECRET_KEY, { expiresIn: '1h' }); // 1 hour expiration
    res.status(200).send({ token }); // Send the token to the client
  } catch (error) {
    res.status(500).send(error);
  }
});

// Middleware to verify token
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send({ error: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.tenant = verified; // Attach the tenant to the request
    next(); // Proceed to the next middleware or route
  } catch (error) {
    res.status(400).send({ error: 'Invalid token' });
  }
};

// Protect the routes with authentication
router.use(authenticate); // Use the authentication middleware for the following routes

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
