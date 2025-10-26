using System.ComponentModel.DataAnnotations;

namespace RestaurantApi.Models
{
    public class OrderDetails
    {
        [Key]
        public int OrderDetailsId { get; set; }
        public long OrderMasterId { get; set; }
        public required OrderMaster OrderMaster { get; set; }
        public int FoodItemId { get; set; }
        public required FoodItem FoodItem { get; set; }
        public decimal FoodItemPrice { get; set; }
        public int Quantity { get; set; }


    }
}
