import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/AddApartment.css';

const AddApartment = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    rent: '',
    contract: '',
    date_of_contract: '',
    status: 'Available', // Default status
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/apartments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create apartment');
      }

      alert('Apartment added successfully');
      navigate('/landlord-dashboard/apartments');
    } catch (error) {
      console.error('Error creating apartment:', error);
    }
  };

  return (
    <div className="add-apartment-page">
      <h2>Add New Apartment</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Apartment Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Rent:
          <input
            type="number"
            name="rent"
            value={formData.rent}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Contract Duration (months):
          <input
            type="number"
            name="contract"
            value={formData.contract}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Date of Contract:
          <input
            type="date"
            name="date_of_contract"
            value={formData.date_of_contract}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Status:
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
          >
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
          </select>
        </label>
        <button type="submit">Add Apartment</button>
        <button type="button" onClick={() => navigate('/apartments')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddApartment;
