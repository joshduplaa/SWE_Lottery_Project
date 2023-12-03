import React from 'react';
import '../page_styles/profile.css'


const AdminProfile = () => {
  // Dummy admin data, replace with real data from your auth system
  const admin = {
    name: "Admin Name",
    email: "admin@example.com",
    role: "Administrator"
  };

  return (
    <div className="admin-profile-container">
      <h1>Admin Profile</h1>
      <div className="admin-profile-details">
        <p><strong>Name:</strong> {admin.name}</p>
        <p><strong>Email:</strong> {admin.email}</p>
        <p><strong>Role:</strong> {admin.role}</p>
      </div>
    </div>
  );
};

export default AdminProfile;