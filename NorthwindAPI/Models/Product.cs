using System.Text.Json.Serialization;

// Represents a product in the system, mapped from DB and serialized to JSON
public class Product
{
    public int ProductID { get; set; } // Primary key

    [JsonPropertyName("productName")]
    public string ProductName { get; set; } = null!; // Name shown in UI

    [JsonPropertyName("supplierID")]
    public int SupplierID { get; set; } // Foreign key to Supplier

    [JsonPropertyName("categoryID")]
    public int CategoryID { get; set; } // Foreign key to Category

    [JsonPropertyName("price")]
    public decimal Price { get; set; } // Product price

    [JsonPropertyName("unit")]
    public string Unit { get; set; } = null!; // Quantity per unit (e.g. "10 boxes")

    public string? CategoryName { get; set; } // Fetched via JOIN for display

    public string? SupplierName { get; set; } // Fetched via JOIN for display
}
