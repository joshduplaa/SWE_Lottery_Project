import React from 'react';

function Navbar() {
  return (
    <nav>
      <div className="profile">Profile</div>
      <div className="nav-links">
        <a href="/tickets">Tickets</a>
        <a href="/about-us">About Us</a>
        <a href="/winnings">Winnings</a>
      </div>
    </nav>
  );
}

export default Navbar;