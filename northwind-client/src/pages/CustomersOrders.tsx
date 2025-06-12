import React, { useEffect, useState } from "react";
import { getCustomerOrders } from "../api/productApi";
import { TopCustomer } from "../types/TopCustomer";
import "./CustomersOrders.css"; 
import '../styles/ui.css';


const CustomersOrders: React.FC = () => {
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);

  // Load top customers once on mount
  useEffect(() => {
    getCustomerOrders()
      .then(setTopCustomers)
      .catch((err) => console.error("Failed to fetch top customers", err));
  }, []);

  return (
    <div className="container">
      <h1 className="title">Customer Orders</h1>

      {/* Top 3 Customers Summary Box */}
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

      {/* Full Customer Table */}
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
