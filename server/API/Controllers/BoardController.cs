using DataAccess;
using DataAccess.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BoardController : ControllerBase
{
    private readonly AppDbContext _context;

    public BoardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetBoards()
    {
        var boards = await _context.Boards.ToListAsync();
        return Ok(boards);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetBoard(Guid id)
    {
        var board = await _context.Boards.FindAsync(id);
        if (board == null)
            return NotFound();
        return Ok(board);
    }

    [HttpPost]
    public async Task<IActionResult> CreateBoard([FromBody] Board board)
    {
        await _context.Boards.AddAsync(board);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBoard), new { id = board.Id }, board);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateBoard(Guid id, [FromBody] Board updatedBoard)
    {
        var board = await _context.Boards.FindAsync(id);
        if (board == null)
            return NotFound();

        board.Numbers = updatedBoard.Numbers;
        board.PlayerId = updatedBoard.PlayerId;
        board.GameId = updatedBoard.GameId;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteBoard(Guid id)
    {
        var board = await _context.Boards.FindAsync(id);
        if (board == null)
            return NotFound();

        _context.Boards.Remove(board);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}