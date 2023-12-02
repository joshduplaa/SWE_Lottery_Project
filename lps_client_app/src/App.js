// App.js
import React from 'react';
import Navbar from './components/Navbar';
import WinningCards from './components/WinningCards';

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