import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../page_styles/orderhistory.css'; // Adjust the path as necessary

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (auth.currentUser) {
        const userEmail = auth.currentUser.email;
        const q = query(collection(firestore, "Purchased Tickets"), where("userEmail", "==", userEmail));

        try {
          const querySnapshot = await getDocs(q);
          const ordersData = querySnapshot.docs.map(doc => doc.data());
          setOrders(ordersData);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Order History</h2>
      {orders.map((order, index) => (
        <div key={index} className="order-card">
          <p>Ticket: {order.ticketName}</p>
          <p>Price: {order.price}</p>
          <p>Quantity: {order.quantity}</p>
          <p>Total: {order.total}</p>
          <p>Numbers: {order.selectedNumbers.join(', ')}</p>
          <p>Purchase Date: {new Date(order.purchaseDate).toLocaleString()}</p>
          {/* Add any other details you want to display */}
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
