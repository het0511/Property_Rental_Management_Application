import React, { useState, useEffect } from 'react';
import './../styles/RentPayment.css';

const RentPayment = () => {
  const [rentDetails, setRentDetails] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [landlordName, setLandlordName] = useState('');

  useEffect(() => {
    const fetchRentDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        // Decode the token to get tenant ID
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        const tenantId = decodedPayload.id;

        // Fetch tenant details
        const tenantResponse = await fetch(`http://localhost:5000/tenants/${tenantId}`, {
          headers: {
            'Authorization': token,
          },
        });

        if (!tenantResponse.ok) {
          throw new Error('Failed to fetch tenant details');
        }

        const tenantData = await tenantResponse.json();
        setTenantName(tenantData.name); // Set tenant name

        // Fetch apartment details
        const apartmentResponse = await fetch(`http://localhost:5000/apartments/public/${tenantData.apartment_id}`, {
          headers: {
            'Authorization': token,
          },
        });

        if (!apartmentResponse.ok) {
          throw new Error('Failed to fetch apartment details');
        }

        const apartmentData = await apartmentResponse.json();
        setRentDetails(apartmentData); // Set rent details

        // Fetch landlord details
        const landlordResponse = await fetch(`http://localhost:5000/landlords/${apartmentData.landlord_id}`, {
          headers: {
            'Authorization': token,
          },
        });

        if (!landlordResponse.ok) {
          throw new Error('Failed to fetch landlord details');
        }

        const landlordData = await landlordResponse.json();
        setLandlordName(landlordData.name); // Set landlord name

      } catch (error) {
        console.error('Error fetching details:', error);
        setError(error.message);
      }
    };

    fetchRentDetails();
  }, []);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // Decode the token to get tenant ID
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload)); // Decode the token
      const response = await fetch(`http://localhost:5000/payments`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenant_id: decodedPayload.id, // Use the tenant ID from the decoded token
          landlord_id: rentDetails.landlord_id, // Landlord ID from rent details
          status: 'Pending', // Set initial status to Pending
          date_of_payment: new Date(), // Current date
          time_period: '1 month', // Modify as needed
          amount: rentDetails.rent, // Use rent amount from rentDetails
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process payment');
      }

      alert('Payment processed successfully');
      setPaymentMethod(''); // Reset payment method
      // Optionally, redirect to the payment history page or do something else after successful payment

    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error.message);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="rent-payment-page">
      <h1>Rent Payment</h1>

      {/* Rent Payment Form */}
      <form onSubmit={handlePaymentSubmit}>
        <div>
          <label>Tenant Name:</label>
          <input type="text" value={tenantName} readOnly />
        </div>
        <div>
          <label>Landlord Name:</label>
          <input type="text" value={landlordName} readOnly />
        </div>
        <div>
          <label>Apartment Name:</label>
          <input type="text" value={rentDetails.name} readOnly /> {/* Changed from apartmentName to name */}
        </div>
        <div>
          <label>Rent Amount:</label>
          <input type="number" value={rentDetails.rent} readOnly /> {/* Changed from amount to rent */}
        </div>
        <div>
          <label>Payment Method:</label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)} 
            required>
            <option value="">Select Payment Method</option>
            <option value="credit-card">Credit Card</option>
            <option value="bank-transfer">Bank Transfer</option>
            <option value="gpay">Gpay</option>
          </select>
        </div>
        <button type="submit" className="submit-payment">Submit Payment</button>
      </form>
    </div>
  );
};

export default RentPayment;
