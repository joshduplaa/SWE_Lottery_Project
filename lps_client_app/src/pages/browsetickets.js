// pages/BrowseTickets.js
import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'; // assuming you're using react-firebase-hooks
import { auth, firestore } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import PurchaseCard from './PurchaseCard';
import '../page_styles/browsetickets.css';


const BrowseTickets = ({ isAuthenticated }) => {
  const [user, loading, error] = useAuthState(auth);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showPurchaseCard, setShowPurchaseCard] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchTickets = async () => {
      const querySnapshot = await getDocs(collection(firestore, "Available Tickets"));
      const ticketsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTickets(ticketsArray);
    };

    fetchTickets();
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    if (!loading && !error) {
      fetchUserData();
    }
  }, [user, loading, error]);


  const handleBuyNow = (ticket) => {
    if (!isAuthenticated) {
      alert('Must be logged in to make a purchase');
      return;
    }
    setSelectedTicket(ticket);
    setShowPurchaseCard(true);
  };

  return (
    <div className="tickets-container">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="ticket-card">
          <h3>{ticket.Name}</h3>
          <p>Price: {ticket.price}</p>
          <p>Jackpot: {ticket.jackpot}</p>
          <button onClick={() => handleBuyNow(ticket)}>Buy Now</button>
        </div>
      ))}
      {showPurchaseCard && selectedTicket && (
        <PurchaseCard
          ticket={selectedTicket}
          onClose={() => setShowPurchaseCard(false)}
        />
      )}
    </div>
  );
};

export default BrowseTickets;
