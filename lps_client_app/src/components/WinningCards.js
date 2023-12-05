import React from 'react';

function WinningCards({ winningNumbers }) {
  return (
    <section className="winning-cards">
      <h2>Last Week's Winning Numbers:</h2>
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
