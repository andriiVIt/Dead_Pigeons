using Microsoft.AspNetCore.Mvc;
using Service.Interfaces;
 
using Service.Player;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlayerController : ControllerBase
{
    private readonly IPlayerService _playerService;

    public PlayerController(IPlayerService playerService)
    {
        _playerService = playerService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPlayers()
    {
        var players = await _playerService.GetAllAsync();
        return Ok(players);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetPlayer(Guid id)
    {
        var player = await _playerService.GetByIdAsync(id);
        if (player == null)
            return NotFound();

        return Ok(player);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePlayer([FromBody] CreatePlayerDto playerDto)
    {
        var createdPlayer = await _playerService.CreatePlayerAsync(playerDto);
        return CreatedAtAction(
            nameof(GetPlayer), 
            new { id = createdPlayer.Id }, 
            createdPlayer
        );
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdatePlayer(Guid id, [FromBody] UpdatePlayerDto updatePlayerDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updatedPlayer = await _playerService.UpdateAsync(id, updatePlayerDto);
        if (updatedPlayer == null)
            return NotFound();

        return Ok(updatedPlayer);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletePlayer(Guid id)
    {
        var success = await _playerService.DeleteAsync(id);
        if (!success)
            return NotFound();

        return NoContent();
    }
}
