using System.ComponentModel.DataAnnotations.Schema;

namespace RestaurantApi.Models
{
    public class OrderMaster
    {
        public long OrderMasterId { get; set; }
        [Column(TypeName = "nvarchar(75)")]
        public required string OrderNumber { get; set; }
        public required int CustomerId { get; set; }
        public  required Customer Customer { get; set; }
        [Column(TypeName = "nvarchar(10)")]
        public required string PMethod { get; set; }
        public required decimal GTotal { get; set; }

        public  required List<OrderDetails> OrderDetails { get; set; }

    }
}
