using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RestaurantApi.Models
{
    public class FoodItem
    {
        [Key]
        public int FoodItemId { get; set; }
        [Column(TypeName = "nvarchar(100)")]
        public required string FoodItemName { get; set; }
        public decimal Price { get; set; }
    }
}
