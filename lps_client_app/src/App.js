// App.js
import React from 'react';
import Navbar from './components/Navbar';
import WinningCards from './components/WinningCards';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Tickets from './pages/browsetickets';
import AboutUs from './pages/aboutus';
import WinningTickets from './pages/winningTickets';
import Profile from './pages/profile';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <WinningCards />
      </main>
    </div>
  );
}

export default App;