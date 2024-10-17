import React, { useEffect } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import Apartments from './Apartments';
import Tenants from './Tenants';
import Profile from './Profile';
import MaintenanceRequests from './MaintenanceRequests';
import './../styles/LandlordDashboard.css'; 

const LandlordDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/landlord-login'); // Redirect if no token found
    }
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('token');
      navigate('/landlord-login');
    }
  };  

  return (
    <div className="landlord-dashboard">
      <Sidebar handleLogout={handleLogout} />
      <div className="main-content">
        <Routes>
          <Route path="apartments" element={<Apartments />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="maintenance" element={<MaintenanceRequests />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

const Sidebar = ({ handleLogout }) => (
  <div className="sidebar">
    <h2>RentEase Dashboard</h2>
    <ul>
      <li>
        <NavLink 
          to="apartments" 
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Manage Apartments
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="tenants" 
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Manage Tenants
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
      <li>
        <NavLink 
          to="profile" 
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          My Profile
        </NavLink>
      </li>
    </ul>
    <button className="logout-button" onClick={handleLogout}>Log Out</button> {/* Logout button */}
  </div>
);

export default LandlordDashboard;
