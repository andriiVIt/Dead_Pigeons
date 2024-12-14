using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Interfaces;
using Service.DTO.Player;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlayerController : ControllerBase
{
    private readonly IPlayerService _service;

    public PlayerController(IPlayerService service)
    {
        _service = service;
    }
    // [Authorize(Roles = "Admin")]
    // [HttpPost]
    // [Route("")]
    // public ActionResult<GetPlayerDto> CreatePlayer([FromBody] CreatePlayerDto createPlayerDto)
    // {
    //     var player = _service.CreatePlayer(createPlayerDto);
    //     return CreatedAtAction(nameof(GetPlayerById), new { id = player.Id }, player);
    // }

    [HttpPut]
    [Route("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public ActionResult<GetPlayerDto> UpdatePlayer(Guid id, [FromBody] UpdatePlayerDto updatePlayerDto)
    {
        var player = _service.UpdatePlayer(id, updatePlayerDto);
        return Ok(player);
    }

    [HttpGet]
    [Route("")]
    public ActionResult<List<GetPlayerDto>> GetAllPlayers(int limit = 10, int startAt = 0)
    {
        var players = _service.GetAllPlayers(limit, startAt);
        return Ok(players);
    }

    [HttpGet]
    [Route("{id:guid}")]
    public ActionResult<GetPlayerDto> GetPlayerById(Guid id)
    {
        var player = _service.GetPlayerById(id);
        if (player == null)
        {
            return NotFound();
        }
        return Ok(player);
    }

    [HttpDelete]
     
    [Route("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePlayer(Guid id)
    {
        // We use the service to delete the player
        var success = _service.DeletePlayer(id);

        if (!success)
        {
            return NotFound(); // If no player found
        }

        return NoContent(); // Successful deletion
    }
}