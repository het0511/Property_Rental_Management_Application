const express = require('express');
const Payment = require('../models/payment');
const jwt = require('jsonwebtoken');
const router = express.Router();

const secretKey = 'het_parikh';

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
