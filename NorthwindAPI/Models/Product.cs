using System.Text.Json.Serialization;

public class Product
{
    public int ProductID { get; set; }

    [JsonPropertyName("productName")]
    public string ProductName { get; set; } = null!;

    [JsonPropertyName("supplierId")]
    public int SupplierID { get; set; }

    [JsonPropertyName("categoryId")]
    public int CategoryID { get; set; }

    [JsonPropertyName("price")]
    public decimal Price { get; set; }

    [JsonPropertyName("unit")]
    public string Unit { get; set; } = null!;

    public string? CategoryName { get; set; }
    public string? SupplierName { get; set; }
}
