import React, { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../api/productApi";
import { Product } from "../types/Product";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

import "./ProductList.css"; 
import '../styles/ui.css';


const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  // Fetch products once on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Load all products from the backend
  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  // Handle deletion of a single product
  const handleDelete = async (productID: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await deleteProduct(productID);
      await fetchProducts();
    } catch (err) {
      alert("❌ Failed to delete. The product may be part of an existing order.");
    }
  };

  // Handle bulk deletion of selected products
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const confirmDelete = window.confirm("Are you sure you want to delete the selected products?");
    if (!confirmDelete) return;

    try {
      await Promise.all(selectedIds.map((id) => deleteProduct(id)));
      setSelectedIds([]);
      setSelectAll(false);
      await fetchProducts();
    } catch (err) {
      alert("❌ Some deletions failed. Please try again.");
    }
  };

  // Export product data to CSV file
  const exportToCSV = () => {
    const csvRows = [
      ["Product ID", "Name", "Category", "Supplier", "Price", "Unit"],
      ...products.map((p) => [
        p.productID,
        p.productName,
        p.categoryName,
        p.supplierName,
        p.price,
        p.unit,
      ]),
    ];

    const blob = new Blob([csvRows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    saveAs(blob, "products.csv");
  };

  // Export product data to PDF file using jsPDF + autoTable
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Product List", 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [["Product ID", "Name", "Category", "Supplier", "Price", "Unit"]],
      body: products.map((p) => [
        p.productID,
        p.productName,
        p.categoryName,
        p.supplierName,
        p.price,
        p.unit,
      ]),
    });
    doc.save("products.pdf");
  };

  // Filter products based on search input
  const filteredProducts = products.filter(
    (p) =>
      p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Select or unselect all visible filtered rows
  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedIds(!selectAll ? filteredProducts.map((p) => p.productID) : []);
  };

  // Select or unselect a single row
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="container">
      <h1 className="title">Product List</h1>

      <input
        type="text"
        placeholder="Search by name or category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="actions">
        <button onClick={exportToCSV}>📄 Export CSV</button>
        <button onClick={exportToPDF}>📄 Export PDF</button>
        <button onClick={handleBulkDelete} disabled={selectedIds.length === 0}>
          🗑 Delete Selected
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Supplier</th>
            <th>Price</th>
            <th>Unit</th>
            <th>Actions</th>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr
              key={p.productID}
              className="table-row"
              onMouseEnter={() => setHoveredRow(p.productID)}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() => navigate(`/update/${p.productID}`)}
            >
              <td>
                {p.productName}
                <span className="edit-icon">✏️</span>
              </td>
              <td>{p.categoryName}</td>
              <td>{p.supplierName}</td>
              <td>₪{p.price}</td>
              <td>{p.unit}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(p.productID)}
                >
                  🗑 Delete
                </button>
              </td>
              <td onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(p.productID)}
                  onChange={() => toggleSelect(p.productID)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
