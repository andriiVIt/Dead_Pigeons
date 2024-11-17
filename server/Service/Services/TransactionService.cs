using DataAccess;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Service.Interfaces;
using Service.DTO.Transaction;

namespace Service.Services;

public class TransactionService : ITransactionService
{
    private readonly AppDbContext _context;
    private readonly IValidator<CreateTransactionDto> _createValidator;
    private readonly IValidator<UpdateTransactionDto> _updateValidator;

    public TransactionService(AppDbContext context, IValidator<CreateTransactionDto> createValidator, IValidator<UpdateTransactionDto> updateValidator)
    {
        _context = context;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    public GetTransactionDto CreateTransaction(CreateTransactionDto createTransactionDto)
    {
        _createValidator.ValidateAndThrow(createTransactionDto);

        var playerExists = _context.Players.Any(p => p.Id == createTransactionDto.PlayerId);
        if (!playerExists)
        {
            throw new ArgumentException("Player does not exist.");
        }

        var transaction = CreateTransactionDto.ToEntity(createTransactionDto);
        _context.Transactions.Add(transaction);
        _context.SaveChanges();

        return GetTransactionDto.FromEntity(transaction);
    }

    public GetTransactionDto UpdateTransaction(Guid id, UpdateTransactionDto updateTransactionDto)
    {
        _updateValidator.ValidateAndThrow(updateTransactionDto);

        var transaction = _context.Transactions.Find(id);
        if (transaction == null)
        {
            throw new KeyNotFoundException("Transaction not found.");
        }

        updateTransactionDto.UpdateEntity(transaction);
        _context.SaveChanges();

        return GetTransactionDto.FromEntity(transaction);
    }

    public GetTransactionDto? GetTransactionById(Guid id)
    {
        var transaction = _context.Transactions
            .Include(t => t.Player)
            .FirstOrDefault(t => t.Id == id);

        return transaction == null ? null : GetTransactionDto.FromEntity(transaction);
    }

    public List<GetTransactionDto> GetAllTransactions(int limit, int startAt)
    {
        var transactions = _context.Transactions
            .OrderBy(t => t.Id)
            .Skip(startAt)
            .Take(limit)
            .Include(t => t.Player)
            .ToList();

        return transactions.Select(GetTransactionDto.FromEntity).ToList();
    }

    public bool DeleteTransaction(Guid id)
    {
        var transaction = _context.Transactions.Find(id);
        if (transaction == null)
        {
            return false;
        }

        _context.Transactions.Remove(transaction);
        _context.SaveChanges();
        return true;
    }
}
