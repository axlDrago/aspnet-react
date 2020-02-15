using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication3.Models
{
    public class Association
    {
        public int ID { get; set; }
        public int Count { get; set; }

        public int BuildingsId { get; set; }
        public Buildings buildings { get; set; }

        public int RoomsId { get; set; }
        public Rooms rooms { get; set; }

        public int EquipmentsId { get; set; }
        public Equipments equipments { get; set; }
    }
}
