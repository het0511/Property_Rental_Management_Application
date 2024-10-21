const express = require('express');
const Payment = require('../models/payment');
const jwt = require('jsonwebtoken');
const router = express.Router();

const secretKey = 'het_parikh';

const getTenantIdFromToken = (req) => {
  const token = req.headers['authorization']?.split(' ')[1]; 
  if (!token) {
    throw new Error('Authentication token is required');
  }
  const decoded = jwt.verify(token, 'het_parikh'); 
  return decoded.id; 
};

// Route to get payment history for a tenant
router.get('/history', async (req, res) => {
  try {
    // Get tenant ID from token
    const tenantId = getTenantIdFromToken(req);

    // Fetch payment history for the tenant
    const payments = await Payment.find({ tenant_id: tenantId });

    // Return the payment history
    res.status(200).send(payments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).send({ error: error.message });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send('Access Denied: No token provided');
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).send('Access Denied: Invalid token');
    }
    req.user = user; // Store user information in request object
    next();
  });
};

// Create a new payment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).send(payment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all payments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).send(payments);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a payment by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).send();
    }
    res.status(200).send(payment);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get payments by tenant ID
router.get('/tenant/:tenantId', authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.find({ tenant_id: req.params.tenantId });
    res.status(200).send(payments);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Public GET route to fetch payment history for a specific tenant
router.get('/public/tenant/:tenantId', async (req, res) => {
  try {
    const tenantId = req.params.tenantId;

    // Fetch payment history for the specified tenant
    const payments = await Payment.find({ tenant_id: tenantId })
      .populate('tenant_id', 'name') // Populate tenant's name if necessary
      .select('date_of_payment amount status time_period'); // Select relevant fields

    if (payments.length === 0) {
      return res.status(404).send({ message: 'No payment history found for this tenant.' });
    }

    res.status(200).send(payments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).send({ error: 'Failed to fetch payment history' });
  }
});

// Update a payment by ID
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!payment) {
      return res.status(404).send();
    }
    res.status(200).send(payment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a payment by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).send();
    }
    res.status(200).send(payment);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
