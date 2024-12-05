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
        // Валідація вхідних даних
        _createValidator.ValidateAndThrow(createTransactionDto);

        // Отримання гравця з бази даних
        var player = _context.Players.FirstOrDefault(p => p.Id == createTransactionDto.PlayerId);
        if (player == null)
        {
            throw new ArgumentException("Player does not exist.");
        }

        if (!player.IsActive)
        {
            throw new InvalidOperationException("Inactive players cannot make transactions.");
        }

        // Початок транзакції
        using var dbTransaction = _context.Database.BeginTransaction();
        try
        {
            // Створення нової транзакції
            var transaction = CreateTransactionDto.ToEntity(createTransactionDto);
            _context.Transactions.Add(transaction);

            // Оновлення балансу гравця
            player.Balance += createTransactionDto.Amount;
            _context.Entry(player).State = EntityState.Modified;

            // Логування для налагодження
            Console.WriteLine($"Player ID: {player.Id}");
            Console.WriteLine($"Balance before: {player.Balance - createTransactionDto.Amount}");
            Console.WriteLine($"Balance after: {player.Balance}");

            // Збереження змін у базі даних
            _context.SaveChanges();

            // Коміт транзакції
            dbTransaction.Commit();

            return GetTransactionDto.FromEntity(transaction);
        }
        catch (Exception ex)
        {
            // Відкат змін у разі помилки
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

        // Початок транзакції
        using var dbTransaction = _context.Database.BeginTransaction();
        try
        {
            Console.WriteLine($"Transaction before saving: {transaction.Amount}, {transaction.MobilePayTransactionId}");
            _context.Entry(transaction).State = EntityState.Modified; // Позначаємо об'єкт як змінений
            _context.SaveChanges(); // Зберігаємо зміни
            dbTransaction.Commit(); // Коміт транзакції
            Console.WriteLine("Transaction committed successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Transaction failed: {ex.Message}");
            dbTransaction.Rollback(); // Відкат змін у разі помилки
            throw; // Проброс помилки далі
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
        // Отримуємо транзакцію
        var transaction = _context.Transactions.Include(t => t.Player).FirstOrDefault(t => t.Id == transactionId);
        if (transaction == null)
        {
            throw new KeyNotFoundException("Transaction not found.");
        }

        // Перевіряємо, чи є гравець
        var player = transaction.Player;
        if (player == null)
        {
            throw new Exception("Player associated with the transaction not found.");
        }

        using var dbTransaction = _context.Database.BeginTransaction();
        try
        {
            // Зменшуємо баланс гравця
            player.Balance -= transaction.Amount;
            _context.Entry(player).State = EntityState.Modified;

            // Видаляємо транзакцію
            _context.Transactions.Remove(transaction);

            // Зберігаємо зміни
            _context.SaveChanges();

            // Коміт транзакції
            dbTransaction.Commit();

            return true;
        }
        catch (Exception ex)
        {
            // Відкат транзакції у разі помилки
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
