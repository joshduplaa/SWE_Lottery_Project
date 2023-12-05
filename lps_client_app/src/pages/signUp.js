// pages/SignupPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firestore } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const SignupPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [creditCard, setCreditCard] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
       // Create user with email and password
       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
       const userId = userCredential.user.uid;
 
       // Check if a Firestore document with the same userId already exists
       const userDocRef = doc(firestore, "users", userId);
       const docSnap = await getDoc(userDocRef);
 
       if (!docSnap.exists()) {
         // If not, create a new document with userId as the document name
         await setDoc(userDocRef, {
           fullName,
           email,
           address,
           creditCard,
           phone,
           password,
           balance: 0,
           userId: userCredential.user.uid
           // Note: Credit card information is omitted for security reasons
         });
 
         alert('Account created successfully');
         navigate('/'); // Redirect to home or login page
       } else {
         // Handle case where a user with this ID already exists
         console.error('User with this ID already exists.');
         // Appropriate user feedback
       }
     } catch (error) {
       alert('Error signing up:', error.message);
       console.error('Error signing up:', error.message);
       // Handle sign up error (show error message)
     }
   };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <h3>Password is a minimum of 6 characters and must use a valid email. May not use an already registered email.</h3>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Physical Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="text" placeholder="Credit Card Number" value={creditCard} onChange={(e) => setCreditCard(e.target.value)} required />
        <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SignupPage;