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

  const toggleStatus = async (paymentId, currentStatus) => {
    const token = localStorage.getItem('token');
    const newStatus = currentStatus === 'Paid' ? 'Pending' : 'Paid'; // Toggle status

    try {
      const response = await fetch(`http://localhost:5000/payments/${paymentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      // Update payment history state with the new status
      setPaymentHistory((prevPayments) =>
        prevPayments.map((payment) =>
          payment._id === paymentId ? { ...payment, status: newStatus } : payment
        )
      );
    } catch (error) {
      console.error('Error updating payment status:', error);
      setErrorMessage('Failed to update payment status.');
    }
  };

  if (loading) {
    return <div>Loading payment history...</div>;
  }

  return (
    <div className="tenant-payment-history">
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
              <th>Actions</th> {/* New column for actions */}
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((payment) => (
              <tr key={payment._id}>
                <td>{new Date(payment.date_of_payment).toLocaleDateString()}</td>
                <td>{payment.amount}</td>
                <td>{payment.status}</td>
                <td>{payment.time_period}</td>
                <td>
                  <button
                    onClick={() => toggleStatus(payment._id, payment.status)}
                  >
                    Edit Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TenantPaymentHistory;
