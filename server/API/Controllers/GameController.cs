using DataAccess;
using DataAccess.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GameController : ControllerBase
{
    private readonly AppDbContext _context;

    public GameController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetGames()
    {
        var games = await _context.Games.ToListAsync();
        return Ok(games);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetGame(Guid id)
    {
        var game = await _context.Games.FindAsync(id);
        if (game == null)
            return NotFound();
        return Ok(game);
    }

    [HttpPost]
    public async Task<IActionResult> CreateGame([FromBody] Game game)
    {
        await _context.Games.AddAsync(game);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetGame), new { id = game.Id }, game);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateGame(Guid id, [FromBody] Game updatedGame)
    {
        var game = await _context.Games.FindAsync(id);
        if (game == null)
            return NotFound();

        game.StartDate = updatedGame.StartDate;
        game.EndDate = updatedGame.EndDate;
        game.WinningSequence = updatedGame.WinningSequence;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteGame(Guid id)
    {
        var game = await _context.Games.FindAsync(id);
        if (game == null)
            return NotFound();

        _context.Games.Remove(game);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}