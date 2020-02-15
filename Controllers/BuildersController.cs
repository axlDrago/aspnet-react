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
    [Route("api/Builders")]
    public class BuildersController : Controller
    {
        private readonly WebApplication3Context _context;

        public BuildersController(WebApplication3Context context)
        {
            _context = context;
        }

        // GET: api/Builders
        [HttpGet]
        public IEnumerable<Buildings> GetBuilders()
        {
            return _context.Buildings;
        }

        // GET: api/Builders/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBuilders([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var builders = await _context.Buildings.SingleOrDefaultAsync(m => m.ID == id);

            if (builders == null)
            {
                return NotFound();
            }

            return Ok(builders);
        }

        // PUT: api/Builders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBuilders([FromRoute] int id, [FromBody] Buildings builders)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != builders.ID)
            {
                return BadRequest();
            }

            _context.Entry(builders).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BuildersExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Builders
        [HttpPost]
        public async Task<IActionResult> PostBuilders([FromBody] Buildings builders)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Buildings.Add(builders);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBuilders", new { id = builders.ID }, builders);
        }

        // DELETE: api/Builders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBuilders([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var builders = await _context.Buildings.SingleOrDefaultAsync(m => m.ID == id);
            if (builders == null)
            {
                return NotFound();
            }

            _context.Buildings.Remove(builders);
            await _context.SaveChangesAsync();

            return Ok(builders);
        }

        private bool BuildersExists(int id)
        {
            return _context.Buildings.Any(e => e.ID == id);
        }
    }
}