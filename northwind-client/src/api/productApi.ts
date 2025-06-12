import axios from "axios";
import { Product } from "../types/Product";
import { TopCustomer } from "../types/TopCustomer";
import { Supplier } from "../types/Supplier";
import { Category } from "../types/Category";

const API_BASE_URL = "https://localhost:7258/api/product";

// Helper to handle API errors consistently
const handleApi = async <T>(fn: () => Promise<T>): Promise<T> => {
  try {
    return await fn();
  } catch (err: any) {
    console.error("❌ API Error:", err.response?.data || err.message);
    throw err;
  }
};

export const getAllProducts = async (): Promise<Product[]> =>
  handleApi(() => axios.get<Product[]>(API_BASE_URL).then(res => res.data));

export const getTopCustomers = async (): Promise<TopCustomer[]> =>
  handleApi(() => axios.get<TopCustomer[]>(`${API_BASE_URL}/top-customers`).then(res => res.data));

export const getCustomerOrders = async (): Promise<TopCustomer[]> =>
  handleApi(() => axios.get(`${API_BASE_URL}/customer-orders`).then(res => res.data));

export const getSuppliers = async (): Promise<Supplier[]> =>
  handleApi(() => axios.get(`${API_BASE_URL}/suppliers`).then(res => res.data));

export const getCategories = async (): Promise<Category[]> =>
  handleApi(() => axios.get(`${API_BASE_URL}/categories`).then(res => res.data));

export const getProductById = async (id: number): Promise<Product> =>
  handleApi(() => axios.get<Product>(`${API_BASE_URL}/${id}`).then(res => res.data));

export const addProduct = async (product: {
  productName: string;
  supplierId: number;
  categoryId: number;
  unit: string;
  price: number;
}) =>
  handleApi(() => axios.post(`${API_BASE_URL}/add`, product));

export const updateProduct = async (product: Product): Promise<void> =>
  handleApi(() => axios.put(`${API_BASE_URL}/update`, product));

export const deleteProduct = async (productID: number): Promise<boolean> =>
  handleApi(() => axios.delete(`${API_BASE_URL}/${productID}`).then(res => res.status === 200));
