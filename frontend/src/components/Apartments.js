import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/Apartments.css';

const Apartments = () => {
  const [apartments, setApartments] = useState([]); 
  const [loading, setLoading] = useState(true);   
  const navigate = useNavigate();  

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await fetch('http://localhost:5000/apartments', {
          headers: {
            'Authorization': token,
          },
        });        

        if (!response.ok) {
          throw new Error('Failed to fetch apartments');
        }

        const data = await response.json();
        setApartments(data);                         
        setLoading(false);                           
      } catch (error) {
        console.error('Error fetching apartments:', error);
        setLoading(false);
      }
    };

    fetchApartments();
  }, []); 

  if (loading) {
    return <div>Loading apartments...</div>; 
  }

  return (
    <div className="apartments-page">
      <h2>Manage Apartments</h2>
      <button className="add-apartment-btn" onClick={() => navigate('/add-apartment')}>
        Add Apartment
      </button>
      <table>
        <thead>
          <tr>
            <th>Apartment Name</th>
            <th>Location</th>
            <th>Rent</th>
            <th>Contract (Months)</th> {/* New column for contract duration */}
            <th>Date of Contract</th>  {/* New column for date_of_contract */}
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {apartments.length === 0 ? (
            <tr>
              <td colSpan="7">No apartments found</td> 
            </tr>
          ) : (
            apartments.map((apartment) => (
              <tr key={apartment._id}>
                <td>{apartment.name || 'N/A'}</td> 
                <td>{apartment.address || 'N/A'}</td>  
                <td>${apartment.rent}</td>
                <td>{apartment.contract || 'N/A'}</td> {/* Display contract duration */}
                <td>{apartment.date_of_contract ? new Date(apartment.date_of_contract).toLocaleDateString() : 'N/A'}</td> {/* Format and display date_of_contract */}
                <td>{apartment.status || 'Unknown'}</td> 
                <td>
                  <button onClick={() => navigate(`/edit-apartment/${apartment._id}`)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(apartment._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Function to handle deletion of an apartment
const handleDelete = async (id) => {
  const confirmed = window.confirm('Are you sure you want to delete this apartment?');
  if (!confirmed) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/apartments/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    });    

    if (!response.ok) {
      throw new Error('Failed to delete apartment');
    }

    alert('Apartment deleted successfully');
    window.location.reload(); // Reload the page to show updated apartments list
  } catch (error) {
    console.error('Error deleting apartment:', error);
  }
};

export default Apartments;
