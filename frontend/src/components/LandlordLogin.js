import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import './../styles/LandlordLogin.css'; // Import CSS file

const LandlordLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Send login request to the backend
    axios.post('http://localhost:5000/landlords/login', { email, password })
      .then((response) => {
        console.log(response.data);

        // Store the JWT token in localStorage
        localStorage.setItem('token', response.data.token);

        // Check the userType and redirect accordingly
        if (response.data.userType === 'landlord') {
          navigate('/landlord-dashboard');
        } else {
          // Handle case for incorrect userType or other users
          setError('Unauthorized access');
        }
      })
      .catch((error) => {
        console.error('Landlord login failed:', error.response ? error.response.data : error.message);
        setError('Invalid email or password');
      });
  };

  return (
    <div className="landlord-login-wrapper">
      <div className="landlord-login-card">
        <h2 className="landlord-login-title">Landlord Login</h2>
        <form className="landlord-login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="landlord-login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="landlord-login-input"
          />
          <center>
            <button type="submit" className="landlord-login-button">Login</button>
          </center>
          {error && <p className="error-message">{error}</p>}
        </form>
        <p className="signup-link">
          Don't have an account? <Link to="/landlord-signup">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LandlordLogin;
