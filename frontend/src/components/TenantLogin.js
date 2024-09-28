import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './../styles/TenantLogin.css'; // Import CSS file

const TenantLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/tenants/login', { email, password });
      console.log(response.data);
      localStorage.setItem('token', response.data.token); // Store token in local storage
      navigate('/tenant-dashboard'); // Redirect to tenant dashboard
    } catch (error) {
      console.error('Tenant login failed:', error.response ? error.response.data : error.message);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="tenant-login-wrapper">
      <div className="tenant-login-card">
        <h2 className="tenant-login-title">Tenant Login</h2>
        <form className="tenant-login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="tenant-login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="tenant-login-input"
          />
          <center><button type="submit" className="tenant-login-button">Login</button></center>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default TenantLogin;
