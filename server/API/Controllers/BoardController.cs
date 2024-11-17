using Microsoft.AspNetCore.Mvc;
using Service.DTO.Board;
using Service.DTO.Board;
using Service.Interfaces;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BoardController : ControllerBase
{
    private readonly IBoardService _service;

    public BoardController(IBoardService service)
    {
        _service = service;
    }

    [HttpPost]
    public ActionResult<GetBoardDto> CreateBoard([FromBody] CreateBoardDto dto)
    {
        var board = _service.CreateBoard(dto);
        return Ok(board);
    }

    [HttpPut("{id:guid}")]
    public ActionResult<GetBoardDto> UpdateBoard(Guid id, [FromBody] UpdateBoardDto dto)
    {
        var board = _service.UpdateBoard(id, dto);
        return Ok(board);
    }

    [HttpGet("{id:guid}")]
    public ActionResult<GetBoardDto> GetBoardById(Guid id)
    {
        var board = _service.GetBoardById(id);
        if (board == null)
            return NotFound();

        return Ok(board);
    }

    [HttpGet]
    public ActionResult<List<GetBoardDto>> GetAllBoards(int limit = 10, int startAt = 0)
    {
        var boards = _service.GetAllBoards(limit, startAt);
        return Ok(boards);
    }

    [HttpDelete("{id:guid}")]
    public ActionResult DeleteBoard(Guid id)
    {
        var success = _service.DeleteBoard(id);
        if (!success)
            return NotFound();

        return NoContent();
    }
}