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
import { collection, getDocs, addDoc, query, where, updateDoc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import OrderHistory from './pages/orderHistory';

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

  const checkForWinnersAndUpdateBalances = async () => {
    // Fetch all winning numbers
    const winningNumbersSnapshot = await getDocs(collection(firestore, "Winning Numbers"));
    const winningNumbersData = winningNumbersSnapshot.docs.map(doc => doc.data());
  
    // Fetch all purchased tickets
    const purchasedTicketsSnapshot = await getDocs(collection(firestore, "Purchased Tickets"));
    const purchasedTicketsData = purchasedTicketsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
    for (const ticket of purchasedTicketsData) {
      for (const winningEntry of winningNumbersData) {
        if (ticket.ticketName === winningEntry.ticketName) {
          // Compare the selected numbers with the winning numbers
          const matchCount = ticket.selectedNumbers.filter(number => winningEntry.WinningNumbers.includes(number)).length;
  
          switch (matchCount) {
            case 5:
              // User wins 100% of the jackpot
              await updateUserBalance(ticket.userEmail, winningEntry.jackpot, 100);
              break;
            case 4:
              // User wins 20% of the jackpot
              await updateUserBalance(ticket.userEmail, winningEntry.jackpot, 20);
              break;
            case 3:
              // User wins 5% of the jackpot
              await updateUserBalance(ticket.userEmail, winningEntry.jackpot, 5);
              break;
            case 2:
              // User wins 1% of the jackpot
              await updateUserBalance(ticket.userEmail, winningEntry.jackpot, 1);
              break;
            default:
              // No win
              break;
          }
        }
      }
    }
  };
  
  const updateUserBalance = async (userEmail, jackpot, percentage) => {
    const userQuery = query(collection(firestore, "users"), where("email", "==", userEmail));
    const userSnapshot = await getDocs(userQuery);
  
    userSnapshot.forEach(async (doc) => {
      const userData = doc.data();
      const additionalBalance = (jackpot * percentage) / 100;
      const updatedBalance = userData.balance + additionalBalance;
  
      const userDocRef = doc(firestore, "users", doc.id);
      await updateDoc(userDocRef, { balance: updatedBalance });
    });
  };

  const handleCountdownFinished = async () => {
    const ticketsSnapshot = await getDocs(collection(firestore, "Available Tickets"));
    const winningNumbersDict = {};

    for (const doc of ticketsSnapshot.docs) {
        const ticketName = doc.data().Name;
        const winningNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 50) + 1);
        
        // Add to winningNumbersDict for local state
        winningNumbersDict[ticketName] = winningNumbers;

        // Prepare to add to Firestore
        try {
            await addDoc(collection(firestore, "Winning Numbers"), {
                ticketName: ticketName,
                WinningNumbers: winningNumbers
            });
        } catch (error) {
            console.error("Error writing winning numbers to Firestore:", error);
        }
    }

    // Update local state
    setWinningNumbers(winningNumbersDict);

    await checkForWinnersAndUpdateBalances();
};


  return (
    <div className="App">
      <Router>
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <main>
          <Routes>
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

