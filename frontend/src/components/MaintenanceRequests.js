import React from 'react';
import './../styles/MaintenanceRequests.css';

const MaintenanceRequests = () => {
  const handleEdit = (requestId) => {
    // Logic to handle editing a maintenance request
    console.log(`Edit request with ID: ${requestId}`);
  };

  const handleDelete = (requestId) => {
    // Logic to handle deleting a maintenance request
    console.log(`Delete request with ID: ${requestId}`);
  };

  return (
    <div className="maintenance-requests-page">
      <h2>Maintenance Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Tenant Name</th>
            <th>Apartment</th>
            <th>Request Date</th>
            <th>Issue</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Maintenance request data should be loaded here */}
          <tr>
            <td>Jane Smith</td>
            <td>Oceanview Apartment</td>
            <td>09/28/2024</td>
            <td>Leaky faucet</td>
            <td>Pending</td>
            <td>
              <button onClick={() => handleEdit(1)}>Edit</button>
              <button className="delete" onClick={() => handleDelete(1)}>Delete</button>
            </td>
          </tr>
          {/* You can add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceRequests;
