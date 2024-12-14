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
        // Validation of input data
        _createValidator.ValidateAndThrow(createTransactionDto);

        // Get the player from the database
        var player = _context.Players.FirstOrDefault(p => p.Id == createTransactionDto.PlayerId);
        if (player == null)
        {
            throw new ArgumentException("Player does not exist.");
        }

        if (!player.IsActive)
        {
            throw new InvalidOperationException("Inactive players cannot make transactions.");
        }

        // Start the transaction
        using var dbTransaction = _context.Database.BeginTransaction();
        try
        {
            // Create a new transaction
            var transaction = CreateTransactionDto.ToEntity(createTransactionDto);
            _context.Transactions.Add(transaction);

            // Update player balance
            player.Balance += createTransactionDto.Amount;
            _context.Entry(player).State = EntityState.Modified;

            // Login for debugging
            Console.WriteLine($"Player ID: {player.Id}");
            Console.WriteLine($"Balance before: {player.Balance - createTransactionDto.Amount}");
            Console.WriteLine($"Balance after: {player.Balance}");

            // Save changes to the database
            _context.SaveChanges();

            // Commit the transaction
            dbTransaction.Commit();

            return GetTransactionDto.FromEntity(transaction);
        }
        catch (Exception ex)
        {
            // Roll back changes in case of error
            dbTransaction.Rollback();
            throw new Exception($"Failed to save transaction and update balance: {ex.Message}");
        }
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

        // Start the transaction
        using var dbTransaction = _context.Database.BeginTransaction();
        try
        {
            Console.WriteLine($"Transaction before saving: {transaction.Amount}, {transaction.MobilePayTransactionId}");
            _context.Entry(transaction).State = EntityState.Modified; // Mark the object as changed
            _context.SaveChanges(); // Save the changes
            dbTransaction.Commit(); // Commit the transaction
            Console.WriteLine("Transaction committed successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Transaction failed: {ex.Message}");
            dbTransaction.Rollback(); // Roll back changes in case of error
            throw; // Throw the error further
        }

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
            .Include(t => t.Player) // Включаємо дані про гравця
            .OrderBy(t => t.Id)
            .Skip(startAt)
            .Take(limit)
            .ToList();

        return transactions.Select(GetTransactionDto.FromEntity).ToList();
    }

    public bool DeleteTransaction(Guid transactionId)
    {
        // We receive a transaction
        var transaction = _context.Transactions.Include(t => t.Player).FirstOrDefault(t => t.Id == transactionId);
        if (transaction == null)
        {
            throw new KeyNotFoundException("Transaction not found.");
        }

        // Check if there is a player
        var player = transaction.Player;
        if (player == null)
        {
            throw new Exception("Player associated with the transaction not found.");
        }

        using var dbTransaction = _context.Database.BeginTransaction();
        try
        {
            // Decrease the player's balance
            player.Balance -= transaction.Amount;
            _context.Entry(player).State = EntityState.Modified;

            // Delete the transaction
            _context.Transactions.Remove(transaction);

            // Save the changes
            _context.SaveChanges();

            // Commit the transaction
            dbTransaction.Commit();

            return true;
        }
        catch (Exception ex)
        {
            // Rollback transaction in case of error
            dbTransaction.Rollback();
            throw new Exception($"Failed to delete transaction and update balance: {ex.Message}");
        }
    }
    public List<GetTransactionDto> GetTransactionsByPlayer(Guid playerId, int limit, int startAt)
    {
        var transactions = _context.Transactions
            .Include(t => t.Player)
            .Where(t => t.PlayerId == playerId) // Фільтрація за PlayerId
            .OrderBy(t => t.TransactionDate)
            .Skip(startAt)
            .Take(limit)
            .ToList();

        return transactions.Select(GetTransactionDto.FromEntity).ToList();
    }

}
