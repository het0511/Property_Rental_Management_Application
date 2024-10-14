import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/AddTenant.css'; 

const AddTenant = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_number: '',
    address: '',
    date_of_birth: '',
    apartment_id: '',
    password: '',
    type: 'Tenant', // Default type
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAddTenant = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/tenants', {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add tenant');
      }

      alert('Tenant added successfully');
      navigate('/landlord-dashboard/tenants');
    } catch (error) {
      console.error('Error adding tenant:', error);
      alert(`Error adding tenant: ${error.message}`);
    }
  };

  return (
    <div className="add-tenant-page">
      <h2>Add New Tenant</h2>
      <form onSubmit={handleAddTenant}>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Mobile Number
          <input
            type="text"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Address
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Date of Birth
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Apartment ID
          <input
            type="text"
            name="apartment_id"
            value={formData.apartment_id}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </label>

        <button type="submit" className="add-tenant-btn">Add Tenant</button>
      </form>
    </div>
  );
};

export default AddTenant;
