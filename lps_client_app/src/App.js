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
import CountdownTimer from './components/countdown';

import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebaseConfig';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [winningNumbers, setWinningNumbers] = useState({});

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

  const handleCountdownFinished = async () => {
    const ticketsSnapshot = await getDocs(collection(firestore, "Available Tickets"));
    const winningNumbersDict = {};

    ticketsSnapshot.forEach(doc => {
      const ticketName = doc.data().Name;
      const randomNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 50) + 1);
      winningNumbersDict[ticketName] = randomNumbers;
    });

    setWinningNumbers(winningNumbersDict);
  };

  return (
    <div className="App">
      <Router>
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<WinningCards winningNumbers={winningNumbers} />} />
            <Route path="/tickets" element={<BrowseTickets isAuthenticated={isAuthenticated} />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/winnings" element={<WinningTickets />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/profile" />} />
            <Route path="/purchase" element={<PurchaseCard />} />
            <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/profile" />} />
          </Routes>
          <CountdownTimer onCountdownFinished={handleCountdownFinished} />
        </main>
      </Router>
    </div>
  );
}

export default App;
