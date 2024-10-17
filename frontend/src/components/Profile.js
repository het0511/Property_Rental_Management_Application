import React, { useState, useEffect } from 'react';
import './../styles/Profile.css';

const Profile = () => {
  const [landlord, setLandlord] = useState({
    name: '',
    email: '',
    mobile_number: '',
    address: '',
    date_of_birth: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchLandlordData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        // Extract landlord ID from the JWT token
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload)); // Decode base64 payload
        const landlordId = decodedPayload.id;

        const response = await fetch(`http://localhost:5000/landlords/${landlordId}`, {
          headers: {
            'Authorization': token,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch landlord details');
        }

        const data = await response.json();
        
        const formattedDateOfBirth = new Date(data.date_of_birth).toISOString().slice(0, 10);
        setLandlord({
          ...data,
          date_of_birth: formattedDateOfBirth,
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchLandlordData();
  }, []);

  const handleChange = (e) => {
    setLandlord({
      ...landlord,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate new password and confirm password match
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/landlords/${landlord._id}/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
          confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Fetch error response from the backend
        throw new Error(errorData.error || 'Failed to update password');
      }

      alert('Password updated successfully');
      setShowPasswordModal(false);
      // Clear password fields
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/landlords/${landlord._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(landlord),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile details');
      }

      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    // Handle input changes for old, new, and confirm passwords
    if (e.target.name === 'oldPassword') {
      setOldPassword(e.target.value);
    } else if (e.target.name === 'newPassword') {
      setNewPassword(e.target.value);
    } else if (e.target.name === 'confirmPassword') {
      setConfirmPassword(e.target.value);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="profile-page">
      <h2>Landlord Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={landlord.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={landlord.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Mobile Number:</label>
          <input
            type="text"
            name="mobile_number"
            value={landlord.mobile_number}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={landlord.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="date_of_birth"
            value={landlord.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">Update Profile</button>
        <button type="button" className="change-password-button" onClick={handlePasswordChange}>Change Password</button>
      </form>

      {showPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>Old Password:</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={oldPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {passwordError && <div className="error">{passwordError}</div>}
              <button type="submit" className="submit-button">Submit</button>
              <button type="button" className="cancel-button" onClick={() => setShowPasswordModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
