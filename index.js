const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const landlordRoutes = require('./routes/landlordRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const apartmentRoutes = require('./routes/apartmentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');

app.use(cors()); 

mongoose.connect('mongodb://localhost:27017/Property_Rental');

app.use(express.json());

// Use routes
app.use('/landlords', landlordRoutes);
app.use('/tenants', tenantRoutes);
app.use('/apartments', apartmentRoutes);
app.use('/payments', paymentRoutes);
app.use('/maintenance', maintenanceRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
