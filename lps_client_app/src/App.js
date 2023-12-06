import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import WinningCards from './components/WinningCards';
import BrowseTickets from './pages/browsetickets';
import AboutUs from './pages/aboutus';
import WinningTickets from './pages/winningTickets';
import Profile from './pages/profile';
import PurchaseCard from './pages/PurchaseCard';
import LoginPage from './pages/login';
import SignupPage from './pages/signUp';
import CountdownTimer from './components/countdown';
import Receipt from './components/receipt';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import OrderHistory from './pages/orderHistory';
import Search from './pages/Search';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [winningNumbers, setWinningNumbers] = useState({});
  const [purchaseDetails, setPurchaseDetails] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setIsAuthenticated(false);
  };

  //Sends Winning numbers to database
  const handleCountdownFinished = async () => {
    const ticketsSnapshot = await getDocs(collection(firestore, "Available Tickets"));
    const winningNumbersDict = {};

    ticketsSnapshot.forEach(async (doc) => {
        const ticketName = doc.data().Name;
        const randomNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 50) + 1);
        winningNumbersDict[ticketName] = randomNumbers;

        // Store in Firestore
        try {
            await addDoc(collection(firestore, "Winning Numbers"), {
                ticketName: ticketName,
                WinningNumbers: randomNumbers
            });
        } catch (error) {
            console.error("Error saving winning numbers to Firestore:", error);
        }
    });

    setWinningNumbers(winningNumbersDict);
};

return (
  <div className="App">
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <main>
        <Routes>
          <Route path="/search" element={<Search />} />
          <Route path="/" element={<WinningCards winningNumbers={winningNumbers} />} />
          <Route path="/tickets" element={<BrowseTickets isAuthenticated={isAuthenticated} setPurchaseDetails={setPurchaseDetails} />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/winnings" element={<WinningTickets />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/profile" />} />
          <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/profile" />} />
          <Route path="/receipt" element={<Receipt purchaseDetails={purchaseDetails} />} />
          <Route path="/order-history" element={<OrderHistory />} />
        </Routes>
        <CountdownTimer onCountdownFinished={handleCountdownFinished} />
      </main>
    </Router>
  </div>
);
}


export default App;