import React, { useState } from 'react';
import { firestore, auth } from '../firebaseConfig';
import { doc, getDoc, updateDoc, setDoc, getDocs, query, collection, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const PurchaseCard = ({ ticket, onClose, setPurchaseDetails }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedNumbers, setSelectedNumbers] = useState(Array(5).fill(1));
  const [isConfirmingPurchase, setIsConfirmingPurchase] = useState(false);
  const Navigate = useNavigate();
  

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

        await updateDoc(userDocRef, { balance: updatedBalance });

        const purchaseData = {
            ticketName: ticket.Name,
            price: ticket.price,
            quantity: quantity,
            total: total,
            selectedNumbers: sortedNumbers,
            purchaseDate: new Date().toISOString(),
            userName: user.displayName,
            userEmail: user.email,
            transactionId: transactionId
        };
        

        await setDoc(doc(firestore, "Purchased Tickets", transactionId), purchaseData);



        // Update transaction status in the "Transaction" collection
        const statusDocRef = doc(firestore, "Transaction", "status");
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

        setPurchaseDetails(purchaseData); // Update purchaseDetails in App.j

        alert('Purchase successful');
        Navigate('/receipt'); // Redirect to the receipt page
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
              onChange={(e) => setQuantity(Math.max(1, Math.min(10, Number(e.target.value))))}
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