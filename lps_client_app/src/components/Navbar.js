import React from 'react';

function Navbar() {
  return (
    <nav>
      <div className="title">Texas Lottery Purchase system</div>
      <div className="nav-links">
        <a href="/tickets">Tickets</a>
        <a href="/about-us">About Us</a>
        <a href="/winnings">Winnings</a>
        <a href="/profile">Profile</a>
      </div>
    </nav>
  );
}

export default Navbar;