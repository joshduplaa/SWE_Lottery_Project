

import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../firebaseConfig';
import { collection, addDoc, getDoc, doc, query, where, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const PurchaseCard = ({ ticket, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedNumbers, setSelectedNumbers] = useState(Array(5).fill(1));
  const [isConfirmingPurchase, setIsConfirmingPurchase] = useState(false);
  

  const handleNumberChange = (index, value) => {
    const newNumbers = [...selectedNumbers];
    newNumbers[index] = Math.max(1, Math.min(50, Number(value)));
    setSelectedNumbers(newNumbers);
  };

  const handleRandomize = () => {
    const randomNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 50) + 1);
    setSelectedNumbers(randomNumbers.sort((a, b) => a - b));
  };

  const handleConfirmPurchase = () => {
    setIsConfirmingPurchase(true);
  };

  const generateTransactionId = async () => {
    let id, exists;
    do {
      id = Math.floor(Math.random() * 1000000).toString();
      const q = query(collection(firestore, "Purchased Tickets"), where("transactionId", "==", id));
      const querySnapshot = await getDocs(q);
      exists = !querySnapshot.empty;
    } while (exists);
    return id;
  };

  const completePurchase = async () => {
    const transactionId = await generateTransactionId();
    const total = quantity * ticket.price;
    const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);
  
    const user = auth.currentUser;
    if (!user) {
      alert('User not found. Please login again.');
      return;
    }
  
    // Fetching and updating user balance
    try {
      const userDocRef = doc(firestore, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (!userDocSnap.exists()) {
        alert("User data not found.");
        return;
      }
  
      const userData = userDocSnap.data();
      const updatedBalance = (userData.balance || 0) - total;
  
      if (updatedBalance < 0) {
        alert("Insufficient balance to complete the purchase.");
        return;
      }
  
      // Update balance in user's document
      await updateDoc(userDocRef, { balance: updatedBalance });
  
      // Proceed with adding the purchase record
      const purchaseDocRef = doc(firestore, "Purchased Tickets", transactionId);
      await setDoc(purchaseDocRef, {
        ticketName: ticket.Name,
        price: ticket.price,
        quantity: quantity,
        total: total,
        selectedNumbers: sortedNumbers,
        purchaseDate: new Date().toISOString(),
        userName: user.displayName, // User's display name
        userEmail: user.email, // User's email
        transactionId: transactionId
      });
  

      //Add logic to increase the NumOfTickets and revenue in the Transaction collection under the status document accordingly
      //NumOfTickets = NumOfTickets + quantity
      //revenue = revenue + total
      const statusDocRef = doc(firestore, "Transaction", "status");
      try {
        const statusDocSnap = await getDoc(statusDocRef);
        if (statusDocSnap.exists()) {
          const statusData = statusDocSnap.data();
          const updatedNumOfTickets = (statusData.NumOfTickets || 0) + quantity;
          const updatedRevenue = (statusData.revenue || 0) + total;

          await updateDoc(statusDocRef, {
            NumOfTickets: updatedNumOfTickets,
            revenue: updatedRevenue
          });
        } else {
          console.log("Status document not found. Creating a new one.");
          await setDoc(statusDocRef, {
            NumOfTickets: quantity,
            revenue: total
          });
        }
      } catch (error) {
        console.error('Error updating transaction status:', error);
      }

      alert('Purchase successful');


      onClose();
    } catch (error) {
      console.error('Error during purchase:', error);
      alert('Purchase Failed');
    }
  };
  
  return (
    <div className="purchase-card">
      {isConfirmingPurchase ? (
        <>
          <h3>Confirm Purchase</h3>
          <p>{`Ticket: ${ticket.Name}, Price: ${ticket.price}, Quantity: ${quantity}, Numbers: ${selectedNumbers.join(', ')}`}</p>
          <button onClick={completePurchase}>Confirm Transaction</button>
          <button onClick={onClose}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{ticket.Name}</h3>
          <div>
            <label>Quantity: </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              min="1"
              max="10"
            />
          </div>
          <div>
            {selectedNumbers.map((number, index) => (
              <input
                key={index}
                type="number"
                value={number}
                onChange={(e) => handleNumberChange(index, e.target.value)}
              />
            ))}
            <button onClick={handleRandomize}>Randomize</button>
          </div>
          <button onClick={handleConfirmPurchase}>Purchase Ticket</button>
          <button onClick={onClose}>Close</button>
        </>
      )}
    </div>
  );
};

export default PurchaseCard;
