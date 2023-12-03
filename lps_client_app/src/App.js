// App.js
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import WinningCards from './components/WinningCards';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Tickets from './pages/browsetickets';
import AboutUs from './pages/aboutus';
import WinningTickets from './pages/winningTickets';
import Profile from './pages/profile';
import Purchase from './pages/purchase';
import LoginPage from './pages/login'; // assuming you have a LoginPage component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLogin = () => {
    // Implement your login logic here
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Implement your logout logic here
    setIsAuthenticated(false);
  };

  return (    
    <div className="App">
      <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <main>
        <Routes>
          <Route path="/" element={<WinningCards />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/winnings" element={<WinningTickets />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/login" element={!isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/profile" />} />
          <Route path="/winnings" element={<WinningTickets />} />
          <Route path="/purchase" element={<Purchase />} />
          
        </Routes>
      </main>
    </Router>
    
    </div>
  );
}

export default App;