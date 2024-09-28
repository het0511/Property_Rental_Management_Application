import React from 'react';
import './../styles/Apartments.css'; 

const Apartments = () => {
  return (
    <div className="apartments-page">
      <h2>Manage Apartments</h2>
      <button className="add-apartment-btn">Add Apartment</button>
      <table>
        <thead>
          <tr>
            <th>Apartment Name</th>
            <th>Location</th>
            <th>Rent</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Apartment data should be loaded here */}
          <tr>
            <td>Sunset Villa</td>
            <td>Downtown</td>
            <td>$1500</td>
            <td>Occupied</td>
            <td>
              <button>Edit</button>
              <button className="delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Apartments;
