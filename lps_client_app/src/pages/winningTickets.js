// pages/PreviouslyWonTickets.js
import '../page_styles/winningTickets.css';
import React, { useState } from 'react';


const PreviouslyWonTickets = () => {
  // Example data for previously won tickets
  const wonTickets = [
    { id: 1, name: "Lotto Max", date: "2023-01-01", amount: "$500,000" },
    { id: 2, name: "Powerball", date: "2023-01-15", amount: "$1,000,000" },
    // ... Add more dummy ticket objects
  ];

  // Ensure you have 10 tickets for the purpose of this example
  while (wonTickets.length < 10) {
    wonTickets.push({
      id: wonTickets.length + 1,
      name: "Ticket " + (wonTickets.length + 1),
      date: "2023-02-" + (wonTickets.length < 9 ? '0' : '') + (wonTickets.length + 1),
      amount: "$" + (100000 * (wonTickets.length + 1)).toLocaleString()
    });
  }

  return (
    <div className="previously-won-tickets-container">
      {wonTickets.map((ticket) => (
        <div key={ticket.id} className="won-ticket-card">
          <h3>{ticket.name}</h3>
          <p>Date Won: {ticket.date}</p>
          <p>Amount: {ticket.amount}</p>
        </div>
      ))}
    </div>
  );
};

export default PreviouslyWonTickets;