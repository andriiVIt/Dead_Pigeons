using Microsoft.AspNetCore.Mvc;
using Service;
using Service.DTO.Game;
using Service.Interfaces;


namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WinnerController : ControllerBase
{
    private readonly IWinnerService _winnerService;

    public WinnerController(IWinnerService winnerService)
    {
        _winnerService = winnerService;
    }

    // Отримання списку переможців для конкретної гри
    [HttpGet]
    [Route("game/{gameId:guid}")]
    public ActionResult<List<GetWinnerDto>> GetWinnersByGame(Guid gameId)
    {
        var winners = _winnerService.GetWinnersByGame(gameId);
        return Ok(winners);
    }
    [HttpPost]
    [Route("game/{gameId:guid}/check")]
    public ActionResult<CheckWinnerResponseDto> CheckForWinner(Guid gameId, [FromBody] Guid playerId)
    {
        var result = _winnerService.CheckForWinner(gameId, playerId);
        return Ok(result);
    }
    // Отримання детальної інформації про конкретного переможця
    [HttpGet]
    [Route("{winnerId:guid}")]
    public ActionResult<GetWinnerDto> GetWinnerById(Guid winnerId)
    {
        var winner = _winnerService.GetWinnerById(winnerId);
        if (winner == null)
        {
            return NotFound();
        }
        return Ok(winner);
    }
}