import React, { useEffect, useState } from "react";
import { getCustomerOrders } from "../api/productApi";
import { TopCustomer } from "../types/TopCustomer";
import "./CustomersOrders.css"; 
import '../styles/ui.css';

// Displays a list of customers and their order counts, including a summary of the top 3
const CustomersOrders: React.FC = () => {
  // Holds all customer order data fetched from the backend
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);

  // Fetches customer orders when component mounts
  useEffect(() => {
    getCustomerOrders()
      .then(setTopCustomers)
      .catch((err) => console.error("Failed to fetch top customers", err));
  }, []);

  return (
    <div className="container">
      <h1 className="title">Customer Orders</h1>

      {/* Summary section: shows the top 3 customers by order count */}
      <div className="summary">
        <h2>Top 3 Customers</h2>
        {topCustomers.length > 0 ? (
          <ul>
            {topCustomers.slice(0, 3).map((c, i) => (
              <li key={i}>
                <strong>{c.customerName}</strong> — {c.orderCount} orders
              </li>
            ))}
          </ul>
        ) : (
          <p>No customer data available.</p>
        )}
      </div>

      {/* Full customer orders table */}
      <table className="table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Order Count</th>
          </tr>
        </thead>
        <tbody>
          {topCustomers.map((c, i) => (
            <tr key={i}>
              <td>{c.customerName}</td>
              <td>{c.orderCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersOrders;
