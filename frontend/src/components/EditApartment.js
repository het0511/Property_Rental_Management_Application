import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './../styles/EditApartment.css';

const EditApartment = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/apartments/${id}`, {
          headers: {
            'Authorization': token,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch apartment details');
        }

        const data = await response.json();
        setApartment(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching apartment:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchApartment();
  }, [id]);

  const handleChange = (e) => {
    setApartment({
      ...apartment,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/apartments/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apartment),
      });

      if (!response.ok) {
        throw new Error('Failed to update apartment details');
      }

      alert('Apartment details updated successfully');
      navigate('/landlord-dashboard/apartments');
    } catch (error) {
      console.error('Error updating apartment:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading apartment details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="edit-apartment-page">
      <h2>Edit Apartment Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Apartment Name:</label>
          <input
            type="text"
            name="name"
            value={apartment.name || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={apartment.address || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Rent:</label>
          <input
            type="number"
            name="rent"
            value={apartment.rent || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select
            name="status"
            value={apartment.status || ''}
            onChange={handleChange}
            required
          >
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Update Apartment</button>
        <button type="button" className="cancel-button" onClick={() => navigate('/landlord-dashboard/apartments')}>Cancel</button>
      </form>
    </div>
  );
};

export default EditApartment;
