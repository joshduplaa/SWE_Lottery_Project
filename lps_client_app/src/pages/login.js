// pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Update this path
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(''); // Reset error message

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Optionally, you can retrieve additional user info from Firestore here if needed
      onLogin();
      alert(`Welcome ${userCredential.user.displayName || 'User'}`); // Display welcome message
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Failed to log in:', error);
      setError('No account found, try again or create an account');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <h2>Please use registered email as username</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Log In</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default LoginPage;
