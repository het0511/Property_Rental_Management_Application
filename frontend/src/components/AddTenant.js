import React, { useEffect, useState } from 'react';
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
  
  const [apartments, setApartments] = useState([]); // State to store apartments
  const navigate = useNavigate();

  // Fetch available apartments for the logged-in landlord
  useEffect(() => {
    const fetchApartments = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('http://localhost:5000/apartments', {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch apartments');
        }

        const data = await response.json();
        setApartments(data); // Store apartments in state
      } catch (error) {
        console.error('Error fetching apartments:', error);
        alert(`Error fetching apartments: ${error.message}`);
      }
    };

    fetchApartments();
  }, []); // Run once on component mount

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
          Apartment
          <select
            name="apartment_id"
            value={formData.apartment_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Select an apartment</option>
            {apartments.map(apartment => (
              <option key={apartment._id} value={apartment._id}>
                {apartment.name} {/* Assuming 'name' is the field you want to display */}
              </option>
            ))}
          </select>
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
        <button type="button" onClick={() => navigate('/landlord-dashboard/tenants')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddTenant;
