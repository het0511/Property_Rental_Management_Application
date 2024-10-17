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

    // Save the new tenant
    await newTenant.save();

    // Update the apartment's status to 'Occupied' and set the date_of_contract
    apartment.status = 'Occupied';
    apartment.date_of_contract = new Date(); // Set the current date as the date of contract
    await apartment.save();

    res.status(201).send(newTenant); // Respond with the created tenant
  } catch (error) {
    console.error('Error creating tenant:', error);
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
    const { apartment_id } = req.body;

    // Find the existing tenant
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).send({ error: 'Tenant not found' });
    }

    // Check if the new apartment is available
    const newApartment = await Apartment.findById(apartment_id);
    if (!newApartment || newApartment.status !== 'Available') {
      return res.status(400).send({ error: 'Cannot assign apartment, it is not available' });
    }

    // Update the apartment status for the old apartment
    if (tenant.apartment_id.toString() !== apartment_id) {
      // Change old apartment status to available
      const oldApartment = await Apartment.findById(tenant.apartment_id);
      if (oldApartment) {
        oldApartment.status = 'Available';
        oldApartment.date_of_contract = null; // Reset the date_of_contract
        await oldApartment.save();
      }
    }

    // Update the tenant's apartment_id
    tenant.apartment_id = apartment_id;

    // Update the new apartment's status to occupied and set the date_of_contract
    newApartment.status = 'Occupied';
    newApartment.date_of_contract = new Date(); // Set the current date as the date of contract
    await newApartment.save();

    // Save the updated tenant
    const updatedTenant = await tenant.save();
    res.status(200).send(updatedTenant);
  } catch (error) {
    console.error('Error updating tenant:', error);
    res.status(500).send({ error: 'Failed to update tenant' });
  }
});

// Delete a tenant by ID and update the related apartment
router.delete('/:id', async (req, res) => {
  try {
    // Find the tenant by ID
    const tenant = await Tenant.findById(req.params.id);

    if (!tenant) {
      return res.status(404).send({ error: 'Tenant not found' });
    }

    // Find the related apartment by the tenant's apartment_id
    const apartment = await Apartment.findById(tenant.apartment_id);

    if (!apartment) {
      return res.status(404).send({ error: 'Related apartment not found' });
    }

    // Delete the tenant
    await Tenant.findByIdAndDelete(req.params.id);

    // Update the apartment's status to 'Available' and clear the date_of_contract
    apartment.status = 'Available';
    apartment.date_of_contract = null; // Optionally clear the contract date
    await apartment.save(); // Save the apartment update

    res.status(200).send({ message: 'Tenant deleted and apartment status updated to Available' });
  } catch (error) {
    console.error('Error deleting tenant or updating apartment:', error);
    res.status(500).send({ error: 'Failed to delete tenant or update apartment' });
  }
});

module.exports = router;
