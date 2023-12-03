// pages/BrowseTickets.js
import React from 'react';
import '../page_styles/browsetickets.css'

const BrowseTickets = () => {
  // Dummy data for tickets, replace with real data from your backend
  const tickets = [
    { id: 1, name: "Lotto Max", price: "$5", jackpot: "$50M" },
    { id: 2, name: "Powerball", price: "$10", jackpot: "$100M" },
    { id: 3, name: "Mega Millions", price: "$10", jackpot: "$150M" },
    // ... Add more dummy ticket objects
  ];

  // Ensure you have 9 tickets for the purpose of this example
  while (tickets.length < 9) {
    tickets.push({ id: tickets.length + 1, name: "Ticket " + (tickets.length + 1), price: "$2", jackpot: "$1M" });
  }

  return (
    <div className="tickets-container">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="ticket-card">
          <h3>{ticket.name}</h3>
          <p>Price: {ticket.price}</p>
          <p>Jackpot: {ticket.jackpot}</p>
          <button>Buy Now</button>
        </div>
      ))}
    </div>
  );
};

export default BrowseTickets;