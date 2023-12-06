import React, { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import '../page_styles/browsetickets.css';


const WinningTickets = () => {
  const [winningTickets, setWinningTickets] = useState([]);

  useEffect(() => {
    const fetchWinningTickets = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "Winners"));
        const tickets = querySnapshot.docs.map(doc => doc.data());
        setWinningTickets(tickets);
      } catch (error) {
        console.error("Error fetching winning tickets:", error);
      }
    };

    fetchWinningTickets();
  }, []);

  return (
    <div className="tickets-container">
      {winningTickets.map((ticket, index) => (
        <div key={index} className="ticket-card">
          <h3>{ticket.ticketName}</h3>
          <p>Email: {ticket.email}</p>
          <p>Jackpot: {ticket.jackpot}</p>
          <p>Date: {new Date(ticket.date).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default WinningTickets;