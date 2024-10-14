import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/Tenants.css';

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/tenants/landlord-tenants', { 
          headers: {
            'Authorization': token,
          },
        });

        if (!response.ok) {
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

  if (loading) {
    return <div>Loading tenants...</div>;
  }

  return (
    <div className="tenants-page">
      <h2>Manage Tenants</h2>
      <button className="add-tenant-btn" onClick={() => navigate('/add-tenant')}>
        Add Tenant
      </button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Apartment</th>
            <th>Email</th>
            <th>Mobile Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.length === 0 ? (
            <tr>
              <td colSpan="5">No tenants found</td>
            </tr>
          ) : (
            tenants.map((tenant) => (
              <tr key={tenant._id}>
                <td>{tenant.name}</td>
                <td>{tenant.apartment_id ? tenant.apartment_id.name : 'N/A'}</td> 
                <td>{tenant.email}</td>
                <td>{tenant.mobile_number}</td>
                <td>
                  <button onClick={() => navigate(`/edit-tenant/${tenant._id}`)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(tenant._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Function to handle deletion of a tenant
const handleDelete = async (id) => {
  const confirmed = window.confirm('Are you sure you want to delete this tenant?');
  if (!confirmed) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/tenants/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete tenant');
    }

    alert('Tenant deleted successfully');
    window.location.reload(); // Reload the page to show updated tenants list
  } catch (error) {
    console.error('Error deleting tenant:', error);
  }
};

export default Tenants;
