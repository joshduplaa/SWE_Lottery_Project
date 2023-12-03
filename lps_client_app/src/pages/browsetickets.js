// pages/BrowseTickets.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../page_styles/browsetickets.css'

const BrowseTickets = () => {
  const navigate = useNavigate();

  // Dummy data for tickets
  const tickets = [
    { id: 1, name: "Lotto Max", price: "$5", jackpot: "$50M" },
    { id: 2, name: "Powerball", price: "$10", jackpot: "$100M" },
    { id: 3, name: "Mega Millions", price: "$10", jackpot: "$150M" },
    // ...other tickets
  ];

  // Ensure you have 9 tickets
  while (tickets.length < 9) {
    tickets.push({ id: tickets.length + 1, name: "Ticket " + (tickets.length + 1), price: "$2", jackpot: "$1M" });
  }

  // Function to handle ticket purchase
  const handlePurchase = (ticketId) => {
    // You can pass the ticketId to the purchase page if needed
    navigate('/purchase', { state: { ticketId: ticketId } });
  };

  return (
    <div className="tickets-container">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="ticket-card">
          <h3>{ticket.name}</h3>
          <p>Price: {ticket.price}</p>
          <p>Jackpot: {ticket.jackpot}</p>
          <button onClick={() => handlePurchase(ticket.id)}>Buy Now</button>
        </div>
      ))}
    </div>
  );
};

export default BrowseTickets;