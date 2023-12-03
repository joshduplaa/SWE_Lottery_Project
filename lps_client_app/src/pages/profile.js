// pages/Profile.js
import React from 'react';
import '../page_styles/profile.css'

const Profile = () => {
  // Dummy user data, replace with real data from your auth system
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    memberSince: "January 2021"
  };

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      <div className="profile-details">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Member Since:</strong> {user.memberSince}</p>
      </div>
    </div>
  );
};

export default Profile;