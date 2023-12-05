import React from 'react';

function Navbar() {
  return (
    <nav>
      <div className="title">
      <a href="/">Texas Lottery Purchase system</a>
      </div>
      <div className="nav-links">
        <a href="/tickets">Tickets</a>
        <a href="/about-us">About Us</a>
        <a href="/winnings">Winnings</a>
        <a href="/profile">Profile</a>
        <a href="/signup">SignUp</a>

      </div>
    </nav>
  );
}

export default Navbar;