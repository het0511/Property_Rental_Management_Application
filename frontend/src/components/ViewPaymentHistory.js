import React, { useEffect, useState } from 'react';
import './../styles/ViewPaymentHistory.css';
import TenantPaymentHistory from './TenantPaymentHistory';

const ViewPaymentHistory = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenantId, setSelectedTenantId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTenants = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/tenants/landlord-tenants', {
          headers: {
            'Authorization': token,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Failed to fetch tenants');
          throw new Error('Failed to fetch tenants');
        }

        const data = await response.json();
        setTenants(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tenants:', error);
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  const handleViewHistory = (tenantId) => {
    setSelectedTenantId(tenantId);
  };

  const handleBack = () => {
    setSelectedTenantId(null); // Reset selected tenant to go back to tenant list
  };

  if (loading) {
    return <div>Loading tenants...</div>;
  }

  return (
    <div className="view-payment-history">
      <h2>View Payment History</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {selectedTenantId ? (
        <div>
          <button onClick={handleBack}>Back to Tenants</button>
          <TenantPaymentHistory tenantId={selectedTenantId} />
        </div>
      ) : (
        <ul>
          {tenants.map((tenant) => (
            <li key={tenant._id}>
              {tenant.name} 
              <button onClick={() => handleViewHistory(tenant._id)}>View Payment History</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewPaymentHistory;
