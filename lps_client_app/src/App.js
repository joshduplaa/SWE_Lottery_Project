import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import WinningCards from './components/WinningCards';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BrowseTickets from './pages/browsetickets';
import AboutUs from './pages/aboutus';
import WinningTickets from './pages/winningTickets';
import Profile from './pages/profile';
import PurchaseCard from './pages/PurchaseCard';
import LoginPage from './pages/login';
import SignupPage from './pages/signUp';

import { auth } from './firebaseConfig'; // Update this path
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Set authenticated state based on user presence
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      <Router>
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<WinningCards />} />
            <Route path="/tickets" element={<BrowseTickets isAuthenticated={isAuthenticated} />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/winnings" element={<WinningTickets />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/profile" />} />
            <Route path="/purchase" element={<PurchaseCard />} />
            <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/profile" />} />

          </Routes>
        </main>
      </Router>
    </div>
          
  );
}

export default App;