using Microsoft.AspNetCore.Mvc;
using NorthwindAPI.Repositories;
using NorthwindAPI.Models;

namespace NorthwindAPI.Controllers
{
    [ApiController]
    [Route("api/product")]
    public class ProductController : ControllerBase
    {
        private readonly ProductRepository _repo;

        public ProductController(ProductRepository repo)
        {
            _repo = repo;
        }

        // Centralized try/catch wrapper
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

        /// <summary>
        /// Get all products in the system.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public Task<IActionResult> GetAllProducts() =>
            SafeExecute(async () =>
            {
                var products = await _repo.GetAllProductsAsync();
                return Ok(products);
            }, nameof(GetAllProducts));

        /// <summary>
        /// Get all available categories.
        /// </summary>
        [HttpGet("categories")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public Task<IActionResult> GetCategories() =>
            SafeExecute(async () =>
            {
                var categories = await _repo.GetCategoriesAsync();
                return Ok(categories);
            }, nameof(GetCategories));

        /// <summary>
        /// Get all available suppliers.
        /// </summary>
        [HttpGet("suppliers")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public Task<IActionResult> GetSuppliers() =>
            SafeExecute(async () =>
            {
                var suppliers = await _repo.GetSuppliersAsync();
                return Ok(suppliers);
            }, nameof(GetSuppliers));

        /// <summary>
        /// Get the number of orders per customer.
        /// </summary>
        [HttpGet("customer-orders")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public Task<IActionResult> GetCustomerOrderCounts() =>
            SafeExecute(async () =>
            {
                var data = await _repo.GetCustomerOrderCountsAsync();
                return Ok(data.Select(c => new { c.customerName, c.orderCount }));
            }, nameof(GetCustomerOrderCounts));

        /// <summary>
        /// Get a product by ID.
        /// </summary>
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

        /// <summary>
        /// Add a new product.
        /// </summary>
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

        /// <summary>
        /// Update an existing product.
        /// </summary>
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

        /// <summary>
        /// Delete a product by ID.
        /// </summary>
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
