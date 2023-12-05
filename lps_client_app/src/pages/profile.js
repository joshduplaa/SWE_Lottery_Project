// pages/Profile.js
import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [showCreditCardUpdate, setShowCreditCardUpdate] = useState(false);
  const [showAddBalance, setShowAddBalance] = useState(false);
  const [newCreditCard, setNewCreditCard] = useState('');
  const [addAmount, setAddAmount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const userDocRef = doc(firestore, "users", userId);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("No such user!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleCreditCardUpdate = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(firestore, "users", userId);
      try {
        await updateDoc(userDocRef, { creditCard: newCreditCard });
        setUserData({ ...userData, creditCard: newCreditCard });
        setShowCreditCardUpdate(false);
        alert("Credit card updated successfully");
      } catch (error) {
        console.error("Error updating credit card:", error);
      }
    }
  };

  const handleAddBalance = async () => {
    if (!userData.creditCard || userData.creditCard.length !== 12) {
      alert("Credit Card Number invalid, not 12 numbers, please update your credit card number");
      return;
    }

    const updatedBalance = (userData.balance || 0) + addAmount;
    const userId = auth.currentUser.uid;
    const userDocRef = doc(firestore, "users", userId);

    try {
      await updateDoc(userDocRef, { balance: updatedBalance });
      setUserData({ ...userData, balance: updatedBalance });
      setShowAddBalance(false);
      alert("Balance updated successfully");
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Assuming you have a way to update the isAuthenticated state in your App component
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };



  if (!userData) {
    return <div>Loading profile...</div>;
  }

return (
  <div className="profile-container">
    <h1>User Profile</h1>
    <div className="profile-details">
      <p><strong>Full Name:</strong> {userData.fullName}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Address:</strong> {userData.address}</p>
      <p><strong>Balance:</strong> {userData.balance}</p>
      {/* Other user details if necessary */}
    </div>
    <button onClick={() => setShowCreditCardUpdate(true)}>Replace Credit Card</button>
    <button onClick={() => setShowAddBalance(true)}>Add Balance</button>
    <button>Withdraw</button> {/* Placeholder for now */}
    <button onClick={() => handleLogout()}>Log Out</button>

    {showCreditCardUpdate && (
      <div className="credit-card-update-container">
        <input 
          type="text" 
          value={newCreditCard} 
          onChange={(e) => setNewCreditCard(e.target.value)} 
          placeholder="New Credit Card Number" 
        />
        <button onClick={handleCreditCardUpdate}>Confirm</button>
      </div>
    )}
    {showAddBalance && (
      <div className="add-balance-container">
        <input 
          type="number" 
          value={addAmount} 
          onChange={(e) => setAddAmount(Number(e.target.value))} 
          placeholder="Amount to Add" 
        />
        <button onClick={handleAddBalance}>Confirm</button>
      </div>
    )}
  </div>
);
};

export default Profile;
