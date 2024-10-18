import React, { useEffect, useState } from 'react';
import './../styles/TenantMaintenance.css';

const TenantMaintenance = () => {
  const [filteredRequests, setFilteredRequests] = useState([]); // Only keep filteredRequests state
  const [loading, setLoading] = useState(true);
  const [newRequest, setNewRequest] = useState('');
  const [landlordId, setLandlordId] = useState(null);

  // Function to fetch maintenance requests
  const fetchMaintenanceRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      const tenantId = decodedPayload.id;

      // Fetch tenant details using tenant_id
      const tenantResponse = await fetch(`http://localhost:5000/tenants/${tenantId}`, {
        headers: {
          'Authorization': token,
        },
      });

      if (!tenantResponse.ok) {
        throw new Error('Failed to fetch tenant details');
      }

      const tenantData = await tenantResponse.json();
      const apartmentId = tenantData.apartment_id; // Extract apartment_id from tenant data

      // Fetch apartment details using apartment_id to get landlord_id
      const apartmentResponse = await fetch(`http://localhost:5000/apartments/public/${apartmentId}`, {
        headers: {
          'Authorization': token,
        },
      });

      if (!apartmentResponse.ok) {
        throw new Error('Failed to fetch apartment details');
      }

      const apartmentData = await apartmentResponse.json();
      setLandlordId(apartmentData.landlord_id); // Get landlord_id from apartment data

      // Fetch all maintenance requests
      const response = await fetch(`http://localhost:5000/maintenance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch maintenance requests');
      }

      const requestsData = await response.json();

      // Filter requests for the current tenant
      const tenantRequests = requestsData.filter(request => request.tenant_id === tenantId);
      setFilteredRequests(tenantRequests);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  // Function to handle the submission of a new maintenance request
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));

      const response = await fetch(`http://localhost:5000/maintenance`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenant_id: decodedPayload.id,
          landlord_id: landlordId, // Use the fetched landlord_id here
          request_type: newRequest,
          status: 'Pending',
          date_of_request: new Date(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit maintenance request');
      }

      alert('Maintenance request submitted successfully');
      setNewRequest(''); // Clear the input field
      fetchMaintenanceRequests(); // Refresh the list of requests
    } catch (error) {
      console.error('Error processing request:', error);
    }
  };

  if (loading) {
    return <div>Loading maintenance requests...</div>;
  }

  return (
    <div className="maintenance-page">
      <h2>Maintenance Requests</h2>
      
      {/* Maintenance Request Form */}
      <form onSubmit={handleRequestSubmit} style={{ marginTop: '20px' }}>
        <div>
          <label htmlFor="newRequest">New Maintenance Request:</label>
          <textarea
            id="newRequest"
            value={newRequest}
            onChange={(e) => setNewRequest(e.target.value)}
            required
            placeholder="Describe the issue..."
          />
        </div>
        <button type="submit" className="submit-request">Submit Request</button>
      </form>

      {/* Maintenance Requests Table */}
      <table>
        <thead>
          <tr>
            <th>Request Type</th>
            <th>Status</th>
            <th>Date of Request</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.length === 0 ? (
            <tr>
              <td colSpan="3">No maintenance requests found</td>
            </tr>
          ) : (
            filteredRequests.map((request) => (
              <tr key={request._id}>
                <td>{request.request_type}</td>
                <td>{request.status}</td>
                <td>{new Date(request.date_of_request).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TenantMaintenance;
