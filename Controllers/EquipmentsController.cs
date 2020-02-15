﻿using System;
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
    [Route("api/Equipments")]
    public class EquipmentsController : Controller
    {
        private readonly WebApplication3Context _context;

        public EquipmentsController(WebApplication3Context context)
        {
            _context = context;
        }

        // GET: api/Equipments
        [HttpGet]
        public IEnumerable<Equipments> GetEquipments()
        {
            return _context.Equipments;
        }

        // GET: api/Equipments/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEquipments([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var equipments = await _context.Equipments.SingleOrDefaultAsync(m => m.ID == id);

            if (equipments == null)
            {
                return NotFound();
            }

            return Ok(equipments);
        }

        // PUT: api/Equipments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEquipments([FromRoute] int id, [FromBody] Equipments equipments)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != equipments.ID)
            {
                return BadRequest();
            }

            _context.Entry(equipments).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EquipmentsExists(id))
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

        // POST: api/Equipments
        [HttpPost]
        public async Task<IActionResult> PostEquipments([FromBody] Equipments equipments)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Equipments.Add(equipments);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEquipments", new { id = equipments.ID }, equipments);
        }

        // DELETE: api/Equipments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipments([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var equipments = await _context.Equipments.SingleOrDefaultAsync(m => m.ID == id);
            if (equipments == null)
            {
                return NotFound();
            }

            _context.Equipments.Remove(equipments);
            await _context.SaveChangesAsync();

            return Ok(equipments);
        }

        private bool EquipmentsExists(int id)
        {
            return _context.Equipments.Any(e => e.ID == id);
        }
    }
}