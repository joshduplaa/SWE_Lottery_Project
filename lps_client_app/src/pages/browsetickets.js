import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import PurchaseCard from './PurchaseCard';
import '../page_styles/browsetickets.css';

const BrowseTickets = ({ isAuthenticated, setPurchaseDetails }) => {
  const [user] = useAuthState(auth);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showPurchaseCard, setShowPurchaseCard] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "Available Tickets"));
        const ticketsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTickets(ticketsArray);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

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

      {selectedTicket && (
        <PurchaseCard
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          setPurchaseDetails={setPurchaseDetails}
        />
      )}
    </div>
  );
};

export default BrowseTickets;
