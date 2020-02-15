using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;

namespace WebApplication3.Models
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new WebApplication3Context(
                serviceProvider.GetRequiredService<DbContextOptions<WebApplication3Context>>()))
            {
                if (!context.Buildings.Any())
                {
                    context.Buildings.AddRange(
                        new Buildings { name = "Building 1" },
                        new Buildings { name = "Building 2" },
                        new Buildings { name = "Building 3" }
                    );
                    context.SaveChanges();
                } 

                if (!context.Rooms.Any())
                {
                    context.Rooms.AddRange(
                        new Rooms { Name = "Room 1" },
                        new Rooms { Name = "Room 2" },
                        new Rooms { Name = "Room 3" },
                        new Rooms { Name = "Room 4" }
                    );
                    context.SaveChanges();
                }               

                if (!context.Equipments.Any())
                {
                    context.Equipments.AddRange(
                        new Equipments { Name = "Equip1" },
                        new Equipments { Name = "Equip2" },
                        new Equipments { Name = "Equip3" },
                        new Equipments { Name = "Equip4" },
                        new Equipments { Name = "Equip5" }
                    );
                    context.SaveChanges();
                } 

                if (!context.Association.Any())
                {
                    context.Association.AddRange(
                        new Association { BuildingsId = 1, EquipmentsId = 1, RoomsId = 1, Count = 1 },
                        new Association { BuildingsId = 1, EquipmentsId = 2, RoomsId = 1, Count = 1 },
                        new Association { BuildingsId = 1, EquipmentsId = 1, RoomsId = 2, Count = 10 },
                        new Association { BuildingsId = 2, EquipmentsId = 3, RoomsId = 1, Count = 10 },
                        new Association { BuildingsId = 2, EquipmentsId = 1, RoomsId = 2, Count = 10 },
                        new Association { BuildingsId = 3, EquipmentsId = 4, RoomsId = 1, Count = 10 }
                    );
                    context.SaveChanges();
                } 
            }
        }
    }
}