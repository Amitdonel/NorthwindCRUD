import React, { useEffect, useState } from "react";
import { addProduct, getCategories, getSuppliers } from "../api/productApi";
import { Category } from "../types/Category";
import { Supplier } from "../types/Supplier";
import "./AddProduct.css"; 
import '../styles/ui.css';


const DRAFT_KEY = "addProductDraft";

const AddProduct: React.FC = () => {
  // Load form state from localStorage draft
  const getInitialDraft = () => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  };

  const draft = getInitialDraft();

  // Controlled form state
  const [productName, setProductName] = useState(draft.productName || "");
  const [supplierId, setSupplierId] = useState<number | null>(draft.supplierId ?? null);
  const [categoryId, setCategoryId] = useState<number | null>(draft.categoryId ?? null);
  const [unit, setUnit] = useState(draft.unit || "");
  const [price, setPrice] = useState<number | "">(draft.price ?? "");

  // Data for dropdowns
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form feedback + validation
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Fetch suppliers and categories
  useEffect(() => {
    getSuppliers().then(setSuppliers);
    getCategories().then(setCategories);
  }, []);

  // Save draft on every input change
  useEffect(() => {
    const draftToSave = { productName, supplierId, categoryId, unit, price };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draftToSave));
  }, [productName, supplierId, categoryId, unit, price]);

  // Basic validation
  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!productName.trim()) errors.productName = "Product name is required.";
    if (!unit.trim()) errors.unit = "Unit is required.";
    if (price === "") errors.price = "Price is required.";
    else if (typeof price === "number" && price < 0) errors.price = "Price cannot be negative.";
    if (!supplierId) errors.supplierId = "Supplier is required.";
    if (!categoryId) errors.categoryId = "Category is required.";
    return errors;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await addProduct({ productName, supplierId: supplierId!, categoryId: categoryId!, price: price as number, unit });
      setSuccessMessage(`Product "${productName}" added successfully!`);
      setProductName("");
      setUnit("");
      setPrice("");
      setSupplierId(null);
      setCategoryId(null);
      setFieldErrors({});
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      setErrorMessage("Something went wrong while adding the product. Please try again.");
    }
  };

  // Clear draft handler
  const handleClearDraft = () => {
    setProductName("");
    setUnit("");
    setPrice("");
    setSupplierId(null);
    setCategoryId(null);
    localStorage.removeItem(DRAFT_KEY);
  };

  return (
    <div className="container">
      <h1 className="title">Add New Product</h1>

      {/* Success message */}
      {successMessage && (
        <div className="success-banner">
          {successMessage}
          <button className="close-button" onClick={() => setSuccessMessage(null)}>×</button>
        </div>
      )}

      {/* Error message */}
      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      {/* Form UI */}
      <form onSubmit={handleSubmit} className="form">
        <label>Product Name</label>
        <input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        {fieldErrors.productName && <div className="error-message">{fieldErrors.productName}</div>}

        <label>Supplier</label>
        <select
          value={supplierId ?? ""}
          onChange={(e) => setSupplierId(Number(e.target.value))}
        >
          <option value="">Select...</option>
          {suppliers.map((s) => (
            <option key={s.supplierID} value={s.supplierID}>{s.supplierName}</option>
          ))}
        </select>
        {fieldErrors.supplierId && <div className="error-message">{fieldErrors.supplierId}</div>}

        <label>Category</label>
        <select
          value={categoryId ?? ""}
          onChange={(e) => setCategoryId(Number(e.target.value))}
        >
          <option value="">Select...</option>
          {categories.map((c) => (
            <option key={c.categoryID} value={c.categoryID}>{c.categoryName}</option>
          ))}
        </select>
        {fieldErrors.categoryId && <div className="error-message">{fieldErrors.categoryId}</div>}

        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          min={0}
        />
        {fieldErrors.price && <div className="error-message">{fieldErrors.price}</div>}

        <label>Unit & Quantity Per Unit</label>
        <input
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
        {fieldErrors.unit && <div className="error-message">{fieldErrors.unit}</div>}

        <div className="form-buttons">
          <button type="submit">Add Product</button>
          <button type="button" onClick={handleClearDraft}>Clear Draft</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
