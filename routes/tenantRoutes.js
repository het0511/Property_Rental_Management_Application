const express = require('express');
const Tenant = require('../models/tenant');
const Apartment = require('../models/apartment');
const jwt = require('jsonwebtoken');
const router = express.Router();
const SECRET_KEY = 'het_parikh'; // Replace with your actual secret key

// Middleware to authenticate tenant
const authenticateTenant = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.tenantId = decoded.id; // Store tenant ID in the request
    next();
  } catch (error) {
    return res.status(401).send('Invalid token.');
  }
};

// Middleware to authenticate landlord (or tenant if required)
const authenticateLandlord = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.landlordId = decoded.id; // Store landlord ID in the request
    next();
  } catch (error) {
    return res.status(401).send('Invalid token.');
  }
};

// Get all tenants for the logged-in landlord
router.get('/landlord-tenants', authenticateLandlord, async (req, res) => {
  try {
    const landlordId = req.landlordId; // Get landlord ID from token

    // Find apartments owned by the landlord
    const apartments = await Apartment.find({ landlord_id: landlordId });
    const apartmentIds = apartments.map(apartment => apartment._id); // Get apartment IDs

    // Find tenants linked to those apartments and populate apartment details
    const tenants = await Tenant.find({ apartment_id: { $in: apartmentIds } })
      .populate('apartment_id', 'name'); // Populate the name field of the apartment

    if (tenants.length === 0) {
      return res.status(404).send({ message: 'No tenants found' });
    }

    res.status(200).send(tenants);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).send({ error: 'Failed to fetch tenants' });
  }
});

// Login a tenant
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const tenant = await Tenant.findOne({ email });
    if (!tenant || password !== tenant.password) { // Direct comparison without hashing
      return res.status(401).send({ error: 'Invalid email or password' });
    }

    // Create a token
    const token = jwt.sign({ id: tenant._id }, SECRET_KEY, { expiresIn: '1h' }); // 1 hour expiration
    res.status(200).send({ token }); // Send the token to the client
  } catch (error) {
    res.status(500).send(error);
  }
});

// Protect the routes with authentication
router.use(authenticateTenant); // Use the authentication middleware for the following routes

// Create a new tenant
router.post('/', async (req, res) => {
  const { name, email, mobile_number, address, date_of_birth, apartment_id, password } = req.body;

  try {
    // Check if the apartment ID is valid and belongs to the landlord
    const apartment = await Apartment.findOne({ _id: apartment_id, landlord_id: req.tenantId });
    if (!apartment) {
      return res.status(400).send({ error: 'Invalid apartment ID or not authorized' });
    }

    // Create a new tenant without hashing the password
    const newTenant = new Tenant({
      name,
      email,
      mobile_number,
      address,
      date_of_birth,
      apartment_id, 
      password, 
      type: 'Tenant', 
    });

    await newTenant.save();
    res.status(201).send(newTenant); // Respond with the created tenant
  } catch (error) {
    res.status(400).send({ error: 'Unable to create tenant' });
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
