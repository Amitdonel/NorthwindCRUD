namespace NorthwindAPI.Models
{
    // Represents a product supplier in the system (used for product association)
    public class Supplier
    {
        public int SupplierID { get; set; }         // Primary key
        public string SupplierName { get; set; }    // Display name of the supplier
    }
}
