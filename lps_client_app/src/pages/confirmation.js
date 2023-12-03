// pages/PurchaseConfirmation.js
import '../page_styles/confirmation.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const PurchaseConfirmation = () => {
  // Example purchase data, replace with actual data after the purchase
  const purchaseDetails = {
    ticketName: "Powerball",
    ticketPrice: "$10",
    purchaseDate: new Date().toLocaleDateString(),
    ticketNumber: "A1B2C3",
    jackpot: "$100M"
  };

  return (
    <div className="purchase-confirmation-container">
      <h1>Purchase Confirmation</h1>
      <div className="confirmation-details">
        <p>Thank you for your purchase!</p>
        <p><strong>Ticket:</strong> {purchaseDetails.ticketName}</p>
        <p><strong>Price:</strong> {purchaseDetails.ticketPrice}</p>
        <p><strong>Purchase Date:</strong> {purchaseDetails.purchaseDate}</p>
        <p><strong>Ticket Number:</strong> {purchaseDetails.ticketNumber}</p>
        <p><strong>Jackpot:</strong> {purchaseDetails.jackpot}</p>
      </div>
    </div>
  );
};

export default PurchaseConfirmation;