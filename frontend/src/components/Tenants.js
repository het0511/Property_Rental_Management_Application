import React from 'react';
import './../styles/Tenants.css'; 

const Tenants = () => {
  const handleAddTenant = () => {
    // Logic to handle adding a tenant, e.g., open a modal or navigate to a form
    console.log("Add Tenant button clicked!");
  };

  return (
    <div className="tenants-page">
      <h2>Manage Tenants</h2>
      <button className="add-tenant-btn" onClick={handleAddTenant}>Add Tenant</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Apartment</th>
            <th>Lease Start</th>
            <th>Lease End</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Tenant data should be loaded here */}
          <tr>
            <td>John Doe</td>
            <td>Sunset Villa</td>
            <td>01/01/2024</td>
            <td>12/31/2024</td>
            <td>
              <button>Edit</button>
              <button className="delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Tenants;
