// pages/Profile.js
import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebaseConfig';
import { doc, getDoc, updateDoc, addDoc, collection, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [showCreditCardUpdate, setShowCreditCardUpdate] = useState(false);
  const [showAddBalance, setShowAddBalance] = useState(false);
  const [newCreditCard, setNewCreditCard] = useState('');
  const [addAmount, setAddAmount] = useState(0);
  const [showTicketManagement, setShowTicketManagement] = useState(false);
  const [modifyTicketMode, setModifyTicketMode] = useState(false);
  const [newTicketData, setNewTicketData] = useState({ Name: '', jackpot: '', price: '' });
  const [ticketToModify, setTicketToModify] = useState('');
  const [lotteryStatus, setLotteryStatus] = useState(null);
  const [showLotteryStatus, setShowLotteryStatus] = useState(false);


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



  const manageTicket = async () => {
    setShowTicketManagement(true);
  };
  
  const handleNewTicket = async () => {
    try {
      // Ensure that the ticket name is provided
      if (!newTicketData.Name) {
        alert("Please provide a ticket name.");
        return;
      }
  
      const ticketRef = doc(firestore, "Available Tickets", newTicketData.Name);
      await setDoc(ticketRef, {
        ...newTicketData
      });
  
      alert("New ticket added successfully.");
      setNewTicketData({ name: '', jackpot: '', price: '' }); // Reset form
      setShowTicketManagement(false); // Close popup
    } catch (error) {
      console.error("Error adding ticket:", error);
    }
  };
  
  
  const handleModifyTicket = async () => {
    // Logic to modify an existing ticket
    const ticketRef = doc(firestore, "Available Tickets", ticketToModify);
    try {
      await updateDoc(ticketRef, newTicketData);
      alert("Ticket modified successfully.");
      setNewTicketData({ Name: '', jackpot: '', price: '' }); // Reset form
      setTicketToModify(''); // Reset ticket name
      setShowTicketManagement(false); // Close popup
    } catch (error) {
      console.error("Error modifying ticket:", error);
    }
  };

  const getLotteryStatus = async () => {
    const statusDocRef = doc(firestore, "Transaction", "status");
    try {
      const docSnap = await getDoc(statusDocRef);
      if (docSnap.exists()) {
        setLotteryStatus(docSnap.data());
        setShowLotteryStatus(true);
      } else {
        console.log("No status document found!");
        setLotteryStatus(null);
      }
    } catch (error) {
      console.error("Error fetching lottery status:", error);
    }
  };


  if (!userData) {
    return <div>Loading profile...</div>;
  }

  if (userData?.Admin) {
    return (
      <div className="profile-container">
        <h1>Admin Profile</h1>
        <div className="profile-details">
          <p><strong>Email:</strong> {userData.email}</p>
        </div>
        {/*button to view, add, remove, or edit*/}
        <button onClick={() => manageTicket(true)}>Manage Ticket</button>
        {/*button to view # of tickets sold and total lottery earnings*/}
        <button onClick={() => getLotteryStatus(true)}>Get Lottery Status</button>
        <button onClick={() => handleLogout()}>Log Out</button>

        {showLotteryStatus && lotteryStatus && (
      <div className="lottery-status">
        <p><strong>Number of Tickets Sold:</strong> {lotteryStatus.NumOfTickets}</p>
        <p><strong>Total Revenue:</strong> {lotteryStatus.revenue}</p>
      </div>
        )}
        {showTicketManagement && (
        <div>
        <button onClick={() => setModifyTicketMode(false)}>Create New Ticket</button>
        <button onClick={() => setModifyTicketMode(true)}>Modify Ticket</button>

          {modifyTicketMode ? (
            // UI to modify a ticket
            <>
              <input
                type="text"
                value={ticketToModify}
                onChange={(e) => setTicketToModify(e.target.value)}
                placeholder="Ticket Name to Modify"
              />
              <button onClick={handleModifyTicket}>Confirm Modify</button>
            </>
              ) : (
            // UI to add a new ticket
            <>
              <input
                type="text"
                value={newTicketData.Name}
                onChange={(e) => setNewTicketData({ ...newTicketData, Name: e.target.value })}
                placeholder="Ticket Name"
              />
              <input
                type="text"
                value={newTicketData.jackpot}
                onChange={(e) => setNewTicketData({ ...newTicketData, jackpot: e.target.value })}
                placeholder="Jackpot"
              />
              <input
                type="text"
                value={newTicketData.price}
                onChange={(e) => setNewTicketData({ ...newTicketData, price: e.target.value })}
                placeholder="Price"
              />
              <button onClick={handleNewTicket}>Confirm New Ticket</button>
            </>
          )}
        </div>
      )}

      </div>
    );
    
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
    <button onClick={() => navigate('/order-history')}>Order History</button>
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
