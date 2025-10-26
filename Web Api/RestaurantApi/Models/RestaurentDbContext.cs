using Microsoft.EntityFrameworkCore;
using System;

namespace RestaurantApi.Models
{
    public class RestaurentDbContext:DbContext
    {
        public RestaurentDbContext(DbContextOptions<RestaurentDbContext> options): base(options)
        {

            
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<FoodItem> FoodItems { get; set; }  
        public DbSet<OrderMaster> OrderMasters { get; set; }
        public DbSet<OrderDetails> OrderDetails { get; set; }


    }
}
