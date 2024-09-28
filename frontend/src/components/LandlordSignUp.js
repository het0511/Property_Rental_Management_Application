import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './../styles/LandlordSignUp.css'; // Import CSS file

const LandlordSignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState(null);
  const [type] = useState('Landlord'); // Default 'Landlord' type
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    const data = {
      name,
      email,
      password,
      mobile_number: mobileNumber,
      address,
      date_of_birth: dateOfBirth,
      type
    };

    console.log('Sending data:', data); // Log data to check before sending

    try {
      const response = await axios.post('http://localhost:5000/landlords', data);
      console.log(response.data);
      navigate('/landlord-login'); // Redirect to landlord login page
    } catch (error) {
      setError(error.response?.data?.error || 'Sign-up failed. Please try again.');
      console.error('Landlord sign-up failed:', error);
    }
  };

  return (
    <div className="landlord-signup-wrapper">
      <div className="landlord-signup-card">
        <h2 className="landlord-signup-title">Landlord Sign Up</h2>
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
        <form className="landlord-signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="landlord-signup-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="landlord-signup-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="landlord-signup-input"
          />
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
            pattern="\d{10}"
            title="Please enter a valid 10-digit mobile number"
            className="landlord-signup-input"
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="landlord-signup-input"
          />
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
            className="landlord-signup-input"
          />
          <center>
            <button type="submit" className="landlord-signup-button">Sign Up</button>
          </center>
        </form>
      </div>
    </div>
  );
};

export default LandlordSignUp;
