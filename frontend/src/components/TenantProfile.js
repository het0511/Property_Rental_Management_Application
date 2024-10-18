import React, { useState, useEffect } from 'react';
import './../styles/Profile.css';

const TenantProfile = () => {
  const [tenant, setTenant] = useState({
    name: '',
    email: '',
    mobile_number: '',
    address: '',
    date_of_birth: '',
    apartment_id: '',
  });
  const [apartment, setApartment] = useState({ name: '' }); // State to hold apartment details
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
  
        // Extract tenant ID from the JWT token
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload)); // Decode base64 payload
        const tenantId = decodedPayload.id;
  
        const response = await fetch(`http://localhost:5000/tenants/${tenantId}`, {
          headers: {
            'Authorization': token,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch tenant details');
        }
  
        const data = await response.json();
        //console.log(data.apartment_id);
        // Fetch apartment details using the apartment ID
        const apartmentResponse = await fetch(`http://localhost:5000/apartments/public/${data.apartment_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
        });
  
        if (!apartmentResponse.ok) {
          throw new Error('Failed to fetch apartment details');
        }
  
        const apartmentData = await apartmentResponse.json();
        
        const formattedDateOfBirth = new Date(data.date_of_birth).toISOString().slice(0, 10);
        setTenant({
          ...data,
          date_of_birth: formattedDateOfBirth,
        });
  
        // Set apartment name
        setApartment(apartmentData);
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.message);
        setLoading(false);
      }
    };
  
    fetchTenantData();
  }, []);

  const handleChange = (e) => {
    setTenant({
      ...tenant,
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
      const response = await fetch(`http://localhost:5000/tenants/${tenant._id}/change-password`, {
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
        const errorData = await response.json();
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
      const response = await fetch(`http://localhost:5000/tenants/auth/${tenant._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tenant),
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
      <h2>Tenant Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={tenant.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={tenant.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Mobile Number:</label>
          <input
            type="text"
            name="mobile_number"
            value={tenant.mobile_number}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={tenant.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="date_of_birth"
            value={tenant.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Apartment Name:</label>
          <input
            type="text"
            value={apartment.name} // Displaying apartment name
            readOnly // Make it read-only
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

export default TenantProfile;
