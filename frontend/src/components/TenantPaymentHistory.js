import React, { useEffect, useState } from 'react';
import './../styles/TenantPaymentHistory.css';

const TenantPaymentHistory = ({ tenantId }) => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:5000/payments/public/tenant/${tenantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Failed to fetch payment history');
          throw new Error('Failed to fetch payment history');
        }

        const data = await response.json();
        setPaymentHistory(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payment history:', error);
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [tenantId]);

  if (loading) {
    return <div>Loading payment history...</div>;
  }

  return (
    <div className="tenant-payment-history">
      <h3>Payment History for Tenant ID: {tenantId}</h3>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {paymentHistory.length === 0 ? (
        <p>No payment history available for this tenant.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date of Payment</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Time Period</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((payment) => (
              <tr key={payment._id}>
                <td>{new Date(payment.date_of_payment).toLocaleDateString()}</td>
                <td>{payment.amount}</td>
                <td>{payment.status}</td>
                <td>{payment.time_period}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TenantPaymentHistory;
