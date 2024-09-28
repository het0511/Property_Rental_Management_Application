import React, { useEffect } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import AccountDetails from './AccountDetails';
import RentPayment from './RentPayment';
import Maintenance from './Maintenance';
import './../styles/TenantDashboard.css';

const TenantDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/tenant-login'); // Redirect if no token found
    }
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('token');
      navigate('/tenant-login');
    }
  };

  return (
    <div className="tenant-dashboard">
      <Sidebar handleLogout={handleLogout} />
      <div className="main-content">
        <Routes>
          <Route path="account" element={<AccountDetails />} />
          <Route path="pay-rent" element={<RentPayment />} />
          <Route path="maintenance" element={<Maintenance />} />
        </Routes>
      </div>
    </div>
  );
};

const Sidebar = ({ handleLogout }) => (
  <div className="sidebar">
    <h2>RentEase Tenant Dashboard</h2>
    <ul>
      <li>
        <NavLink 
          to="account" 
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Manage Account
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="pay-rent" 
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Pay Rent
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="maintenance" 
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Maintenance Requests
        </NavLink>
      </li>
    </ul>
    <button className="logout-button" onClick={handleLogout}>Log Out</button>
  </div>
);

export default TenantDashboard;
