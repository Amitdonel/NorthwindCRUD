namespace NorthwindAPI.Models
{
    // Represents a product category (used for filtering/grouping products)
    public class Category
    {
        public int CategoryID { get; set; }          // Primary key
        public string CategoryName { get; set; }     // Display name of the category
    }
}
