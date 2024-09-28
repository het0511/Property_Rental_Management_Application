import React from 'react';
import { Link } from 'react-router-dom';
import './styles/home.css';

const Home = () => {
  return (
    <div className="homepage">
      <div className="header">
        <h1>Welcome to RentEase</h1>
        <p>Effortlessly manage your properties and tenants with ease.</p>
      </div>
      <div className="login-options">
        <Link to="/landlord-login">
          <button className="btn-landlord">Login as Landlord</button>
        </Link>
        <Link to="/tenant-login">
          <button className="btn-tenant">Login as Tenant</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
