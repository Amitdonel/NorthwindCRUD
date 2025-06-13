using System.Data;
using System.Data.SqlClient;
using NorthwindAPI.Models;

namespace NorthwindAPI.Repositories
{
    // Handles all product-related database operations
    public class ProductRepository
    {
        private readonly IConfiguration _config;

        // Inject appsettings configuration to access DB connection string
        public ProductRepository(IConfiguration config)
        {
            _config = config;
        }

        // Logs SQL-related errors to console (centralized logger)
        private void LogSqlError(string context, Exception ex)
        {
            Console.WriteLine($"🔥 SQL ERROR in {context}: {ex.Message}");
        }

        // Fetch all products with joined category and supplier names
        public async Task<List<Product>> GetAllProductsAsync()
        {
            var products = new List<Product>();

            try
            {
                using var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
                using var cmd = new SqlCommand("GetAllProducts", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                await conn.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    products.Add(new Product
                    {
                        ProductID = reader.GetInt32(0),
                        ProductName = reader.GetString(1),
                        Unit = reader.GetString(2),
                        Price = reader.GetDecimal(3),
                        CategoryName = reader.GetString(4),
                        SupplierName = reader.GetString(5)
                    });
                }
            }
            catch (Exception ex)
            {
                LogSqlError("GetAllProductsAsync", ex);
            }

            return products;
        }

        // Fetch number of orders per customer (for reporting)
        public async Task<List<(string customerName, int orderCount)>> GetCustomerOrderCountsAsync()
        {
            var result = new List<(string, int)>();

            try
            {
                using var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
                using var cmd = new SqlCommand("GetCustomerOrderCounts", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                await conn.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    result.Add((reader.GetString(0), reader.GetInt32(1)));
                }
            }
            catch (Exception ex)
            {
                LogSqlError("GetCustomerOrderCountsAsync", ex);
            }

            return result;
        }

        // Insert a new product using a stored procedure
        public async Task AddProductAsync(Product product)
        {
            try
            {
                using var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
                using var cmd = new SqlCommand("AddProduct", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@ProductName", product.ProductName);
                cmd.Parameters.AddWithValue("@SupplierID", product.SupplierID);
                cmd.Parameters.AddWithValue("@CategoryID", product.CategoryID);
                cmd.Parameters.AddWithValue("@Unit", product.Unit);
                cmd.Parameters.AddWithValue("@Price", product.Price);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
            }
            catch (Exception ex)
            {
                LogSqlError("AddProductAsync", ex);
                throw;
            }
        }

        // Load all categories from DB
        public async Task<List<Category>> GetCategoriesAsync()
        {
            var categories = new List<Category>();

            try
            {
                using var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
                using var cmd = new SqlCommand("SELECT CategoryID, CategoryName FROM Categories", conn);

                await conn.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    categories.Add(new Category
                    {
                        CategoryID = reader.GetInt32(0),
                        CategoryName = reader.GetString(1)
                    });
                }
            }
            catch (Exception ex)
            {
                LogSqlError("GetCategoriesAsync", ex);
            }

            return categories;
        }

        // Load all suppliers from DB
        public async Task<List<Supplier>> GetSuppliersAsync()
        {
            var suppliers = new List<Supplier>();

            try
            {
                using var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
                using var cmd = new SqlCommand("SELECT SupplierID, SupplierName FROM Suppliers", conn);

                await conn.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    suppliers.Add(new Supplier
                    {
                        SupplierID = reader.GetInt32(0),
                        SupplierName = reader.GetString(1)
                    });
                }
            }
            catch (Exception ex)
            {
                LogSqlError("GetSuppliersAsync", ex);
            }

            return suppliers;
        }

        // Get a single product by ID (with JOIN to Category and Supplier)
        public async Task<Product?> GetProductByIdAsync(int id)
        {
            try
            {
                using var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
                using var cmd = new SqlCommand(@"
                    SELECT p.ProductID, p.ProductName, p.Unit, p.Price,
                           c.CategoryID, c.CategoryName,
                           s.SupplierID, s.SupplierName
                    FROM Products p
                    LEFT JOIN Categories c ON p.CategoryID = c.CategoryID
                    LEFT JOIN Suppliers s ON p.SupplierID = s.SupplierID
                    WHERE p.ProductID = @ProductID", conn);

                cmd.Parameters.AddWithValue("@ProductID", id);
                await conn.OpenAsync();

                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new Product
                    {
                        ProductID = reader.GetInt32(0),
                        ProductName = reader.GetString(1),
                        Unit = reader.GetString(2),
                        Price = reader.GetDecimal(3),
                        CategoryID = reader.GetInt32(4),
                        CategoryName = reader.GetString(5),
                        SupplierID = reader.GetInt32(6),
                        SupplierName = reader.GetString(7)
                    };
                }
            }
            catch (Exception ex)
            {
                LogSqlError("GetProductByIdAsync", ex);
            }

            return null;
        }

        // Update a product using stored procedure
        public async Task UpdateProductAsync(Product product)
        {
            try
            {
                using var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
                using var cmd = new SqlCommand("UpdateProduct", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@ProductID", product.ProductID);
                cmd.Parameters.AddWithValue("@ProductName", product.ProductName);
                cmd.Parameters.AddWithValue("@SupplierID", product.SupplierID);
                cmd.Parameters.AddWithValue("@CategoryID", product.CategoryID);
                cmd.Parameters.AddWithValue("@Unit", product.Unit);
                cmd.Parameters.AddWithValue("@Price", product.Price);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
            }
            catch (Exception ex)
            {
                LogSqlError("UpdateProductAsync", ex);
                throw;
            }
        }

        // Delete product by ID using stored procedure
        public async Task<bool> DeleteProductAsync(int productId)
        {
            try
            {
                using var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
                using var cmd = new SqlCommand("DeleteProduct", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@ProductID", productId);

                await conn.OpenAsync();
                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                return rowsAffected > 0;
            }
            catch (SqlException ex)
            {
                LogSqlError("DeleteProductAsync", ex);
                return false;
            }
        }
    }
}
