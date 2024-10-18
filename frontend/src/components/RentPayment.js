import React, { useState, useEffect } from 'react';
import './../styles/RentPayment.css';

const RentPayment = () => {
  const [rentDetails, setRentDetails] = useState({});
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    // Fetch rent details from API
    // setRentDetails(response.data);
  }, []);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Handle the payment logic
  };

  return (
    <div className="rent-payment-page">
      <h1>Rent Payment</h1>

      {/* Rent Summary */}
      <div className="rent-summary">
        <h2>Rent Summary</h2>
        <p>Apartment: {rentDetails.apartmentName}</p>
        <p>Address: {rentDetails.address}</p>
        <p>Rent Due: ${rentDetails.amountDue}</p>
        <p>Due Date: {rentDetails.dueDate}</p>
      </div>

      {/* Payment Section */}
      <div className="payment-section">
        <h2>Make Payment</h2>
        <form onSubmit={handlePaymentSubmit}>
          <label htmlFor="amount">Amount to Pay:</label>
          <input 
            type="number" 
            id="amount" 
            value={paymentAmount} 
            onChange={(e) => setPaymentAmount(e.target.value)} 
            placeholder={`$${rentDetails.amountDue}`} 
          />

          <label htmlFor="payment-method">Payment Method:</label>
          <select 
            id="payment-method" 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="">Select Payment Method</option>
            <option value="credit-card">Credit Card</option>
            <option value="bank-transfer">Bank Transfer</option>
            <option value="paypal">PayPal</option>
          </select>

          <button type="submit" className="submit-payment">Submit Payment</button>
        </form>
      </div>

      {/* Payment History */}
      <div className="payment-history">
        <h2>Payment History</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Map over payment history */}
            <tr>
              <td>01/10/2024</td>
              <td>$1200</td>
              <td>Paid</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentPayment;
