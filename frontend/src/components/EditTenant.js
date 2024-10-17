import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './../styles/EditTenant.css';

const EditTenant = () => {
  const { id } = useParams(); // Tenant ID from URL
  const [tenant, setTenant] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/tenants/${id}`, {
          headers: {
            'Authorization': token,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tenant details');
        }

        const data = await response.json();
        setTenant(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tenant:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchApartments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/apartments', {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch apartments');
        }

        const data = await response.json();
        // Filter only the apartments with status 'Available'
        const availableApartments = data.filter(apartment => apartment.status === 'Available');
        setApartments(availableApartments);
      } catch (error) {
        console.error('Error fetching apartments:', error);
        setError(error.message);
      }
    };

    fetchTenant();
    fetchApartments();
  }, [id]);

  const handleApartmentChange = (e) => {
    setTenant({
      ...tenant,
      apartment_id: e.target.value, // Update only the apartment_id field
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/tenants/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apartment_id: tenant.apartment_id }), // Only send updated apartment_id
      });

      if (!response.ok) {
        throw new Error('Failed to update tenant apartment');
      }

      alert('Tenant apartment updated successfully');
      navigate('/landlord-dashboard/tenants');
    } catch (error) {
      console.error('Error updating tenant:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading tenant details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="edit-tenant-page">
      <h2>Edit Tenant Apartment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Apartment:</label>
          <select
            name="apartment_id"
            value={tenant.apartment_id || ''}
            onChange={handleApartmentChange}
            required
          >
            <option value="">Select an apartment</option>
            {apartments.map((apartment) => (
              <option key={apartment._id} value={apartment._id}>
                {apartment.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-button">Update Apartment</button>
        <button type="button" className="cancel-button" onClick={() => navigate('/landlord-dashboard/tenants')}>Cancel</button>
      </form>
    </div>
  );
};

export default EditTenant;
