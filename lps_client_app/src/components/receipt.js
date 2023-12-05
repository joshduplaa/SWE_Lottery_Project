import React from 'react';

const Receipt = ({ purchaseDetails }) => {
  if (!purchaseDetails) {
    return <div className="receipt">
      <h2>Purchase Receipt</h2>
      <p>No purchase details available.</p>
    </div>;
  }

  return (
    <div className="receipt">
      <h2>Purchase Receipt</h2>
      <p><strong>Ticket:</strong> {purchaseDetails.ticketName}</p>
      <p><strong>Price:</strong> {purchaseDetails.price}</p>
      <p><strong>Quantity:</strong> {purchaseDetails.quantity}</p>
      <p><strong>Total:</strong> {purchaseDetails.total}</p>
      <p><strong>Numbers:</strong> {purchaseDetails.selectedNumbers.join(', ')}</p>
      <p><strong>Purchase Date:</strong> {new Date(purchaseDetails.purchaseDate).toLocaleString()}</p>
      {/* Add any other details you want to display */}
    </div>
  );
};

export default Receipt;