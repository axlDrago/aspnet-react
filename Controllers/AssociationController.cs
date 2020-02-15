using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication3.Models;

namespace WebApplication3.Controllers
{
    [Produces("application/json")]
    [Route("api/Associations")]
    public class AssociationsController : Controller
    {
        private readonly WebApplication3Context _context;

        public AssociationsController(WebApplication3Context context)
        {
            _context = context;
        }

        // GET: api/Associations
        [HttpGet]
        public IEnumerable<Association> GetAssociation()
        {
            var response = _context.Association
                .Include(test => test.buildings)
                .Include(test => test.rooms)
                .Include(test => test.equipments)
                .ToList();

            return response ;
        }

        // GET: api/Associations/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAssociation([FromRoute] string id)
        {
            var idArr = id.Split('_');
            var buildsId = Int32.Parse(idArr[0]);
            var roomId = Int32.Parse(idArr[1]);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            dynamic response = null;
            
            if (roomId != 0)
            {
               response = await _context.Association
                  .Include(test => test.buildings)
                  .Include(test => test.rooms)
                  .Include(eq => eq.equipments)
                  .Where(b => b.BuildingsId == buildsId && b.RoomsId == roomId)
                  .ToListAsync();
            } else
            {
                response = await _context.Association
                  .Include(test => test.buildings)
                  .Include(test => test.rooms)
                  .Include(eq => eq.equipments)
                  .Where(b => b.BuildingsId == buildsId)
                  .ToListAsync();
            }

            if (response == null)
            {
                return NotFound();
            }
            
            return Ok(response);
        }

        // PUT: api/Associations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAssociation([FromRoute] string id)
        {
            var idArr = id.Split('_');
            var action =  idArr[0].ToString();
            var buildsId = Int32.Parse(idArr[1]);
            var roomId = Int32.Parse(idArr[2]);
            var eqId = Int32.Parse(idArr[3]);
            
            var response = _context.Association
                .Where(b => b.BuildingsId == buildsId && b.RoomsId == roomId && b.EquipmentsId == eqId)
               .FirstOrDefault();

            if (action == "up") {
                response.Count = response.Count + 1;
            } else if(action == "down" && response.Count > 1)
            {
                response.Count = response.Count - 1;
            }

            await _context.SaveChangesAsync();

            return Ok(response);
        }

        // POST: api/Associations
        [HttpPost]
        public async Task<IActionResult> PostAssociation([FromBody] Association association)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Association.Add(association);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAssociation", new { id = association.ID }, association);
        }

        // DELETE: api/Associations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssociation([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var association = await _context.Association.SingleOrDefaultAsync(m => m.ID == id);
            if (association == null)
            {
                return NotFound();
            }

            _context.Association.Remove(association);
            await _context.SaveChangesAsync();

            return Ok(association);
        }

        private bool AssociationExists(int id)
        {
            return _context.Association.Any(e => e.ID == id);
        }
    }
}