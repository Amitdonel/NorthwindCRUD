import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import UpdateProduct from "./pages/UpdateProduct";
import CustomersOrders from "./pages/CustomersOrders";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";
import "./styles/ui.css"; // Shared styles

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        {/* Top bar with theme toggle and nav */}
        <header className="app-header">
          <div className="app-top">
            <nav className="app-nav">
              <Link to="/">Product List</Link>
              <Link to="/customers">Customer Orders</Link>
              <Link to="/add">Add Product</Link>
            </nav>
            <ThemeToggle />
          </div>
        </header>


        {/* Page Routes */}
        <main className="app-main">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/customers" element={<CustomersOrders />} />
            <Route path="/update/:id" element={<UpdateProduct />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
