namespace Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Service.DTO.Game;
using Service.Interfaces;

[ApiController]
[Route("api/[controller]")]
public class GameController : ControllerBase
{
    private readonly IGameService _service;

    public GameController(IGameService service)
    {
        _service = service;
    }

    [HttpPost]
    public ActionResult<GetGameDto> CreateGame(CreateGameDto createGameDto)
    {
        var game = _service.CreateGame(createGameDto);
        return Ok(game);
    }

    [HttpPut("{id:guid}")]
    public ActionResult<GetGameDto> UpdateGame(Guid id, UpdateGameDto updateGameDto)
    {
        var game = _service.UpdateGame(id, updateGameDto);
        return Ok(game);
    }

    [HttpGet]
    public ActionResult<List<GetGameDto>> GetAllGames(int limit = 10, int startAt = 0)
    {
        var games = _service.GetAllGames(limit, startAt);
        return Ok(games);
    }

    [HttpGet("{id:guid}")]
    public ActionResult<GetGameDto> GetGameById(Guid id)
    {
        var game = _service.GetGameById(id);
        if (game == null) return NotFound();

        return Ok(game);
    }

    [HttpDelete("{id:guid}")]
    public ActionResult DeleteGame(Guid id)
    {
        var success = _service.DeleteGame(id);
        if (!success) return NotFound();

        return NoContent();
    }
    [HttpPost]
    [Route("{gameId:guid}/check-winner")]
    public ActionResult<CheckWinnerResponseDto> CheckWinner(Guid gameId, [FromBody] Guid playerId)
    {
        var result = _service.CheckForWinner(gameId, playerId);
        return Ok(result);
    }
}