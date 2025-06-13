import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategories, getProductById, getSuppliers, updateProduct } from "../api/productApi";
import { Category } from "../types/Category";
import { Supplier } from "../types/Supplier";
import { Product } from "../types/Product";
import "./UpdateProduct.css";
import '../styles/ui.css';

const UpdateProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  // ✅ Fetch product + dropdown data
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [prod, sup, cat] = await Promise.all([
          getProductById(parseInt(id)),
          getSuppliers(),
          getCategories(),
        ]);
        setProduct(prod);
        setSuppliers(sup);
        setCategories(cat);
      } catch (err) {
        setError("❌ Failed to load data");
      }
    };

    fetchData();
  }, [id]);

  // ✅ Handle field change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!product) return;
    const { name, value } = e.target;

    setProduct({
      ...product,
      [name]:
        name === "price" ? parseFloat(value) :
        name === "supplierID" || name === "categoryID" ? parseInt(value) :
        value
    });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!product?.productName || !product.supplierID || !product.categoryID || !product.unit || !product.price) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!window.confirm("Are you sure you want to update this product?")) return;

    try {
      await updateProduct(product);
      setSuccess(true);
    } catch {
      setError("Failed to update product. Please try again.");
    }
  };

  if (!product) return <p className="container">Loading...</p>;

  return (
    <div className="container">
      <h2 className="title">Update Product</h2>

      {error && <div className="error-message">{error}</div>}

      {success && (
        <div className="success-banner">
          ✅ Product updated successfully
          <button onClick={() => setSuccess(false)}>×</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <label>Product Name</label>
        <input name="productName" value={product.productName} onChange={handleChange} required />

        <label>Supplier</label>
        <select
          name="supplierID"
          value={String(product.supplierID)} // ✅ fixed: cast to string
          onChange={handleChange}
          required
        >
          <option value="">-- Select --</option>
          {suppliers.map((s) => (
            <option key={s.supplierID} value={s.supplierID.toString()}>
              {s.supplierName}
            </option>
          ))}
        </select>

        <label>Category</label>
        <select
          name="categoryID"
          value={String(product.categoryID)} // ✅ fixed: cast to string
          onChange={handleChange}
          required
        >
          <option value="">-- Select --</option>
          {categories.map((c) => (
            <option key={c.categoryID} value={c.categoryID.toString()}>
              {c.categoryName}
            </option>
          ))}
        </select>

        <label>Unit & Quantity Per Unit</label>
        <input name="unit" value={product.unit} onChange={handleChange} required />

        <label>Price</label>
        <input type="number" name="price" value={product.price} onChange={handleChange} required min={0} />

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateProduct;
