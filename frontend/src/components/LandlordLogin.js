import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './../styles/LandlordLogin.css'; // Import CSS file

const LandlordLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    axios.post('http://localhost:5000/landlords/login', { email, password })
      .then((response) => {
        console.log(response.data);
        navigate('/landlord-dashboard');
      })
      .catch((error) => {
        console.error('Landlord login failed:', error.response ? error.response.data : error.message);
        setError('Invalid email or password');
      });
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Landlord Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />
        <button type="submit" className="login-button">Login</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default LandlordLogin;
