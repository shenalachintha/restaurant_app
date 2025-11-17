using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace MyApp.Models.Data
{
    public class MyAppContext:DbContext
    {
        public MyAppContext( DbContextOptions<MyAppContext> options):base(options)
        { 
        
        
        }
        public DbSet<Item> Items { get; set; }

    }
}
