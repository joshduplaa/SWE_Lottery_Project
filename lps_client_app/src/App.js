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
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
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

  //Sends Winning numbers to database and determines if anyone has won
  const handleCountdownFinished = async () => {
    const ticketsSnapshot = await getDocs(collection(firestore, "Available Tickets"));
    const winningNumbersDict = {};

    for (let doc of ticketsSnapshot.docs) {
        const ticketName = doc.data().Name;
        const randomNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 50) + 1).sort((a, b) => a - b);
        winningNumbersDict[ticketName] = randomNumbers;

        // Store in Firestore
        try {
            await addDoc(collection(firestore, "Winning Numbers"), {
                ticketName: ticketName,
                WinningNumbers: randomNumbers,
                date: new Date().toISOString()
            });

            // Check for winning tickets
            const purchasedTicketsSnapshot = await getDocs(query(collection(firestore, "Purchased Tickets"), where("ticketName", "==", ticketName)));
            purchasedTicketsSnapshot.forEach(ticketDoc => {
                const purchasedTicket = ticketDoc.data();
                if (arraysMatch(purchasedTicket.selectedNumbers.sort((a, b) => a - b), randomNumbers)) {
                    // Handle winning ticket
                    console.log("Winning ticket found:", ticketDoc.id, purchasedTicket);
                    // You can update the document or perform other actions as needed
                }
            });
        } catch (error) {
            console.error("Error saving winning numbers or checking tickets:", error);
        }
    }

    setWinningNumbers(winningNumbersDict);
};

// Helper function to compare two arrays
function arraysMatch(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

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