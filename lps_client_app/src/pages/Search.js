// Search.js

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { firestore } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "Available Tickets"));
        const filteredTickets = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(ticket => ticket.Name.toLowerCase().includes(query.toLowerCase()));
        setTickets(filteredTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    if (query) {
      fetchTickets();
    }
  }, [query]);

  return (
    <div className="tickets-container">
      {tickets.map(ticket => (
        <div key={ticket.id} className="ticket-card">
          <h3>{ticket.Name}</h3>
          <p>Price: {ticket.price}</p>
          <p>Jackpot: {ticket.jackpot}</p>
          {/* Add Buy Now button or other elements as needed */}
        </div>
      ))}
    </div>
  );
};

export default Search;