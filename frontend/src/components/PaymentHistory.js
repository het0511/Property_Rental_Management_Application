import React, { useEffect, useState } from 'react';

const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMessage, setPaymentMessage] = useState('');

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/payments/history', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch payment history');
        }
        const data = await response.json();
        setPaymentHistory(data);
        setLoading(false);
        checkPaymentStatus(data); // Check for payment status after fetching data
      } catch (error) {
        console.error('Error fetching payment history:', error);
      }
    };

    fetchPaymentHistory();
  }, []);

  const checkPaymentStatus = (payments) => {
    // Filter out only the payments with status 'Paid'
    const paidPayments = payments.filter(payment => payment.status === 'Paid');

    if (paidPayments.length > 0) {
      const lastPayment = paidPayments[paidPayments.length - 1];
      const lastPaymentDate = new Date(lastPayment.date_of_payment);
      const currentDate = new Date();

      const lastPaymentMonth = lastPaymentDate.getMonth();
      const lastPaymentYear = lastPaymentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      // Check if the last payment was in the current month
      if (lastPaymentYear === currentYear && lastPaymentMonth === currentMonth) {
        setPaymentMessage('Payment for this month is completed.');
      } else if (lastPaymentYear === currentYear && lastPaymentMonth === currentMonth - 1) {
        // Check if last payment was in the previous month
        setPaymentMessage('Payment for this month is pending.');
      } else {
        // Last payment was made more than one month ago
        setPaymentMessage('Payment for this month is pending.');
      }
    } else {
      setPaymentMessage('No completed payments found.');
    }
  };

  if (loading) {
    return <div>Loading payment history...</div>;
  }

  return (
    <div className="payment-history">
      <h2>Payment History</h2>
      {paymentMessage && <p>{paymentMessage}</p>}
      {paymentHistory.length === 0 ? (
        <p>No payment history available.</p>
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

export default PaymentHistory;
