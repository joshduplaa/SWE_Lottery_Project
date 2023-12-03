import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../page_styles/purchase.css';



const Purchase = () => {
  // Example purchase data, replace with actual data after the purchase
  const purchaseDetails = {
    ticketName: "Powerball",
    ticketPrice: "$10",
    purchaseDate: new Date().toLocaleDateString(),
    ticketNumber: "A1B2C3",
    jackpot: "$100M"
  };

  return (
    <div className="purchase-details">
      <h1>Purchase Confirmation</h1>
      <div className="confirmation-details">
        <p>Current Purchase</p>
        <p><strong>Ticket:</strong> {purchaseDetails.ticketName}</p>
        <p><strong>Price:</strong> {purchaseDetails.ticketPrice}</p>
        <p><strong>Quantity to Purchase:</strong>
        toggle with range of numbers 1-10
        </p>
        <p><strong>Numbers:</strong> {purchaseDetails.jackpot}</p>
        <p><strong>Numbers:</strong> {purchaseDetails.jackpot}</p>
        <p><strong>Jackpot:</strong> {purchaseDetails.jackpot}</p>
      </div>
    </div>
  );
};

export default Purchase;