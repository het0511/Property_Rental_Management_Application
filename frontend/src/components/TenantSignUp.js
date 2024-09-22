import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TenantSignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile_number, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState('Tenant'); // Assuming you're only allowing Tenant sign-up
  const [apartment_id, setApartmentId] = useState('');
  const [date_of_birth, setDateOfBirth] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/tenants', {
        name,
        email,
        password,
        mobile_number,
        address,
        type, // Add this
        apartment_id, // Add this
        date_of_birth, // Add this
      });
      console.log(response.data);
      navigate('/tenant-dashboard');
    } catch (error) {
      console.error('Tenant sign-up failed:', error);
      alert(error.response?.data?.error || 'An error occurred during sign-up');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <label>Mobile Number:</label>
      <input type="text" value={mobile_number} onChange={(e) => setMobileNumber(e.target.value)} required />
      <label>Address:</label>
      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
      <label>Type:</label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Tenant">Tenant</option>
        <option value="Landlord">Landlord</option>
      </select>
      <label>Apartment ID:</label>
      <input type="text" value={apartment_id} onChange={(e) => setApartmentId(e.target.value)} required />
      <label>Date of Birth:</label>
      <input type="date" value={date_of_birth} onChange={(e) => setDateOfBirth(e.target.value)} required />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default TenantSignUp;
