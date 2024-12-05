using Microsoft.AspNetCore.Mvc;
using Service.Interfaces;
using Service.DTO.Transaction;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionController : ControllerBase
{
    private readonly ITransactionService _service;

    public TransactionController(ITransactionService service)
    {
        _service = service;
    }

    [HttpPost]
    public ActionResult<GetTransactionDto> CreateTransaction(CreateTransactionDto createTransactionDto)
    {
        var transaction = _service.CreateTransaction(createTransactionDto);
        return Ok(transaction);
    }

    [HttpPut("{id:guid}")]
    public ActionResult<GetTransactionDto> UpdateTransaction(Guid id, UpdateTransactionDto updateTransactionDto)
    {
        var transaction = _service.UpdateTransaction(id, updateTransactionDto);
        return Ok(transaction);
    }

    [HttpGet("{id:guid}")]
    public ActionResult<GetTransactionDto> GetTransactionById(Guid id)
    {
        var transaction = _service.GetTransactionById(id);
        if (transaction == null)
        {
            return NotFound();
        }

        return Ok(transaction);
    }

    [HttpGet]
    public ActionResult<List<GetTransactionDto>> GetAllTransactions(int limit = 10, int startAt = 0)
    {
        var transactions = _service.GetAllTransactions(limit, startAt);
        return Ok(transactions);
    }

    [HttpDelete("{id:guid}")]
    public ActionResult DeleteTransaction(Guid id)
    {
        var success = _service.DeleteTransaction(id);
        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }
    [HttpGet("player/{playerId}")]
    public IActionResult GetPlayerTransactions(Guid playerId, int limit = 10, int startAt = 0)
    {
        var transactions = _service.GetTransactionsByPlayer(playerId, limit, startAt);
        return Ok(transactions);
    }

}