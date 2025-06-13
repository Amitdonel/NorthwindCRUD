using Microsoft.AspNetCore.Mvc;
using NorthwindAPI.Repositories;
using NorthwindAPI.Models;

namespace NorthwindAPI.Controllers
{
    [ApiController]
    [Route("api/product")] // Base route for all product-related endpoints
    public class ProductController : ControllerBase
    {
        private readonly ProductRepository _repo;

        // Inject repository dependency via constructor
        public ProductController(ProductRepository repo)
        {
            _repo = repo;
        }

        // Wrapper to centralize error handling and avoid repetitive try/catch
        private async Task<IActionResult> SafeExecute(Func<Task<IActionResult>> action, string actionName)
        {
            try
            {
                return await action();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ ERROR in {actionName}: {ex.Message}");
                return StatusCode(500, $"An unexpected error occurred while processing {actionName}.");
            }
        }

        // Get all products in the database
        [HttpGet]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public Task<IActionResult> GetAllProducts() =>
            SafeExecute(async () =>
            {
                var products = await _repo.GetAllProductsAsync();
                return Ok(products);
            }, nameof(GetAllProducts));

        // Get all categories to populate form dropdowns
        [HttpGet("categories")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public Task<IActionResult> GetCategories() =>
            SafeExecute(async () =>
            {
                var categories = await _repo.GetCategoriesAsync();
                return Ok(categories);
            }, nameof(GetCategories));

        // Get all suppliers to populate form dropdowns
        [HttpGet("suppliers")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public Task<IActionResult> GetSuppliers() =>
            SafeExecute(async () =>
            {
                var suppliers = await _repo.GetSuppliersAsync();
                return Ok(suppliers);
            }, nameof(GetSuppliers));

        // Return customer names with their order count (for analytics)
        [HttpGet("customer-orders")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public Task<IActionResult> GetCustomerOrderCounts() =>
            SafeExecute(async () =>
            {
                var data = await _repo.GetCustomerOrderCountsAsync();
                return Ok(data.Select(c => new { c.customerName, c.orderCount }));
            }, nameof(GetCustomerOrderCounts));

        // Fetch a single product by ID
        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public Task<IActionResult> GetProductById(int id) =>
            SafeExecute(async () =>
            {
                var product = await _repo.GetProductByIdAsync(id);
                if (product == null)
                    return NotFound("Product not found");
                return Ok(product);
            }, nameof(GetProductById));

        // Add a new product to the system
        [HttpPost("add")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public Task<IActionResult> AddProduct([FromBody] Product product) =>
            SafeExecute(async () =>
            {
                Console.WriteLine("🚀 AddProduct endpoint triggered");
                await _repo.AddProductAsync(product);
                return Ok("Product added successfully.");
            }, nameof(AddProduct));

        // Update an existing product
        [HttpPut("update")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public Task<IActionResult> UpdateProduct([FromBody] Product product) =>
            SafeExecute(async () =>
            {
                Console.WriteLine("🛠️ UpdateProduct endpoint triggered");
                await _repo.UpdateProductAsync(product);
                return Ok("Product updated successfully.");
            }, nameof(UpdateProduct));

        // Delete a product by its ID
        [HttpDelete("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public Task<IActionResult> DeleteProduct(int id) =>
            SafeExecute(async () =>
            {
                await _repo.DeleteProductAsync(id);
                return Ok("Product deleted.");
            }, nameof(DeleteProduct));
    }
}
