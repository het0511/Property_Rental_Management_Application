import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/LandlordDashboard.css'; // Import the CSS file

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>Landlord Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      <div className="button-group">
        <button className="dashboard-button" onClick={() => navigate('/tenant-management')}>Manage Tenants</button>
        <button className="dashboard-button" onClick={() => navigate('/property-management')}>Manage Apartments</button>
        <button className="dashboard-button" onClick={() => navigate('/maintenance-requests')}>Maintenance Requests</button>
      </div>
    </div>
  );
}

export default Dashboard;