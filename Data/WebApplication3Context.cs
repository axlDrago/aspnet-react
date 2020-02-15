using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApplication3.Models;

namespace WebApplication3.Models
{
    public class WebApplication3Context : DbContext
    {
        public WebApplication3Context()
        {
        }

        public WebApplication3Context(DbContextOptions<WebApplication3Context> options)
            : base(options)
        {
        }

        public DbSet<Buildings> Buildings { get; set; }
        public DbSet<Association> Association { get; set; }
        public DbSet<Rooms> Rooms { get; set; }
        public DbSet<Equipments> Equipments { get; set; }
                  
    }
}
