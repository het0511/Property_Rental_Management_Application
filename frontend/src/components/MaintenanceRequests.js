import React, { useEffect, useState } from 'react';
import './../styles/MaintenanceRequests.css';

const MaintenanceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all maintenance requests for the landlord
  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/maintenance/landlord', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Check if the response is okay (status 200)
        if (!response.ok) {
          throw new Error('Failed to fetch maintenance requests');
        }

        const data = await response.json();
        setRequests(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching maintenance requests:', error);
      }
    };

    fetchMaintenanceRequests();
  }, []);

  const handleEdit = async (requestId) => {
    const newStatus = prompt("Enter new status (e.g., 'Resolved', 'In Progress'):");
    if (newStatus) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:5000/maintenance/landlord/${requestId}/status`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
          const updatedRequest = await response.json();
          setRequests(requests.map(request => 
            request._id === updatedRequest._id ? updatedRequest : request
          ));
          console.log('Status updated successfully');
        } else {
          console.error('Failed to update the status');
        }
      } catch (error) {
        console.error('Error updating the status:', error);
      }
    }
  };

  const handleDelete = async (requestId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/maintenance/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setRequests(requests.filter(request => request._id !== requestId));
        console.log('Request deleted successfully');
      } else {
        console.error('Failed to delete the request');
      }
    } catch (error) {
      console.error('Error deleting the request:', error);
    }
  };

  if (loading) {
    return <div>Loading maintenance requests...</div>;
  }

  return (
    <div className="maintenance-requests-page">
      <h2>Maintenance Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Tenant Name</th>
            <th>Request Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="4">No maintenance requests found</td>
            </tr>
          ) : (
            requests.map((request) => (
              <tr key={request._id}>
                <td>{request.tenant_name}</td>
                <td>{request.request_type}</td>
                <td>{request.status}</td>
                <td>
                  <button onClick={() => handleEdit(request._id)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(request._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceRequests;
