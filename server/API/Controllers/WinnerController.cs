using DataAccess;
using DataAccess.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WinnerController : ControllerBase
{
    private readonly AppDbContext _context;

    public WinnerController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetWinners()
    {
        var winners = await _context.Winners.ToListAsync();
        return Ok(winners);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetWinner(Guid id)
    {
        var winner = await _context.Winners.FindAsync(id);
        if (winner == null)
            return NotFound();
        return Ok(winner);
    }

    [HttpPost]
    public async Task<IActionResult> CreateWinner([FromBody] Winner winner)
    {
        await _context.Winners.AddAsync(winner);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetWinner), new { id = winner.Id }, winner);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateWinner(Guid id, [FromBody] Winner updatedWinner)
    {
        var winner = await _context.Winners.FindAsync(id);
        if (winner == null)
            return NotFound();

        winner.PlayerId = updatedWinner.PlayerId;
        winner.GameId = updatedWinner.GameId;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteWinner(Guid id)
    {
        var winner = await _context.Winners.FindAsync(id);
        if (winner == null)
            return NotFound();

        _context.Winners.Remove(winner);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}