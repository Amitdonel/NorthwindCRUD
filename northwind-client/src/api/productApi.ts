import axios from "axios";
import { Product } from "../types/Product";
import { TopCustomer } from "../types/TopCustomer";
import { Supplier } from "../types/Supplier";
import { Category } from "../types/Category";

// Base URL for all product-related API calls
const API_BASE_URL = "https://localhost:7258/api/product";

// Helper to consistently handle API errors and simplify error management
const handleApi = async <T>(fn: () => Promise<T>): Promise<T> => {
  try {
    return await fn();
  } catch (err: any) {
    console.error("❌ API Error:", err.response?.data || err.message);
    throw err;
  }
};

// Fetches all products from the backend and returns an array of Product objects
export const getAllProducts = async (): Promise<Product[]> =>
  handleApi(() => axios.get<Product[]>(API_BASE_URL).then(res => res.data));

// Retrieves a list of top customers based on purchase metrics (value or frequency)
export const getTopCustomers = async (): Promise<TopCustomer[]> =>
  handleApi(() => axios.get<TopCustomer[]>(`${API_BASE_URL}/top-customers`).then(res => res.data));

// Gets all customer orders for analytics or admin usage
export const getCustomerOrders = async (): Promise<TopCustomer[]> =>
  handleApi(() => axios.get(`${API_BASE_URL}/customer-orders`).then(res => res.data));

// Fetches all suppliers to populate form dropdowns or assign products
export const getSuppliers = async (): Promise<Supplier[]> =>
  handleApi(() => axios.get(`${API_BASE_URL}/suppliers`).then(res => res.data));

// Fetches product categories to support product creation or filtering
export const getCategories = async (): Promise<Category[]> =>
  handleApi(() => axios.get(`${API_BASE_URL}/categories`).then(res => res.data));

// Retrieves a specific product by its ID for editing or display
export const getProductById = async (id: number): Promise<Product> =>
  handleApi(() => axios.get<Product>(`${API_BASE_URL}/${id}`).then(res => res.data));

// Sends a new product to the backend (with basic required fields)
export const addProduct = async (product: {
  productName: string;
  supplierId: number;
  categoryId: number;
  unit: string;
  price: number;
}) =>
  handleApi(() => axios.post(`${API_BASE_URL}/add`, product));

// Updates an existing product in the database based on full Product object
export const updateProduct = async (product: Product): Promise<void> =>
  handleApi(() => axios.put(`${API_BASE_URL}/update`, product));

// Deletes a product by its ID. Returns true if deletion was successful (status code 200)
export const deleteProduct = async (productID: number): Promise<boolean> =>
  handleApi(() => axios.delete(`${API_BASE_URL}/${productID}`).then(res => res.status === 200));
