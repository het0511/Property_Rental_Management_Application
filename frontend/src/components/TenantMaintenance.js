import React, { useEffect, useState } from 'react';
import './../styles/TenantMaintenance.css';

const TenantMaintenance = () => {
  const [filteredRequests, setFilteredRequests] = useState([]); // Only keep filteredRequests state
  const [loading, setLoading] = useState(true);
  const [newRequest, setNewRequest] = useState('');
  const [landlordId, setLandlordId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [updatedRequestType, setUpdatedRequestType] = useState('');

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

  // Function to handle editing a request type
  const handleEdit = (request) => {
    setEditMode(true);
    setEditingRequest(request);
    setUpdatedRequestType(request.request_type); // Set the current request type in the form
  };

  // Function to update the request
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/maintenance/${editingRequest._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request_type: updatedRequestType,
          status: 'Pending',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update maintenance request');
      }

      alert('Request updated successfully');
      setEditMode(false);
      setEditingRequest(null);
      fetchMaintenanceRequests(); // Refresh the list of requests
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  // Function to delete a request
  const handleDelete = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/maintenance/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete maintenance request');
      }

      alert('Request deleted successfully');
      fetchMaintenanceRequests(); // Refresh the list of requests
    } catch (error) {
      console.error('Error deleting request:', error);
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.length === 0 ? (
            <tr>
              <td colSpan="4">No maintenance requests found</td>
            </tr>
          ) : (
            filteredRequests.map((request) => (
              <tr key={request._id}>
                <td>{request.request_type}</td>
                <td>{request.status}</td>
                <td>{new Date(request.date_of_request).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(request)}>Edit</button>
                  <button onClick={() => handleDelete(request._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Edit Request Modal */}
      {editMode && (
        <div className="edit-modal">
          <h3>Edit Maintenance Request</h3>
          <form onSubmit={handleUpdateSubmit}>
            <label htmlFor="updatedRequestType">Request Type:</label>
            <input
              type="text"
              id="updatedRequestType"
              value={updatedRequestType}
              onChange={(e) => setUpdatedRequestType(e.target.value)}
              required
            />
            <button type="submit">Update Request</button>
            <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TenantMaintenance;
