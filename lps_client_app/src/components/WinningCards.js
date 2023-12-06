
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../page_styles/browsetickets.css';



function WinningCards({ winningNumbers }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search?query=${searchQuery}`);
  };

  return (
    <section className="winning-cards">
      <input 
        type="text" 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        placeholder="Search tickets"
      />
      <button onClick={handleSearch}>Search Tickets</button>
      <h2>This Week's Winning Numbers:</h2>
      {winningNumbers && (
        <table>
          <thead>
            <tr>
              <th>Lottery Ticket</th>
              <th>Winning Numbers</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(winningNumbers).map(([ticketName, numbers]) => (
              <tr key={ticketName}>
                <td>{ticketName}</td>
                <td>{numbers.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Displaying previous winnings */}
      <div>
        <h3>Previous Winnings</h3>
        {/* Placeholder for previous winnings data */}
        {/* Add your previous winnings data here */}
      </div>
    </section>
  );
}

export default WinningCards;
