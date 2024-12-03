using DataAccess.models;

public class GetTransactionDto
{
    public Guid Id { get; set; }
    public Guid PlayerId { get; set; }
    public string PlayerName { get; set; } = string.Empty; // Додано PlayerName
    public decimal Amount { get; set; }
    public string MobilePayTransactionId { get; set; } = string.Empty;
    public DateTime TransactionDate { get; set; }

    public static GetTransactionDto FromEntity(Transaction transaction)
    {
        return new GetTransactionDto
        {
            Id = transaction.Id,
            PlayerId = transaction.PlayerId,
            PlayerName = transaction.Player?.Name ?? "Unknown", // Перевірка на null
            Amount = transaction.Amount,
            MobilePayTransactionId = transaction.MobilePayTransactionId ?? string.Empty,
            TransactionDate = transaction.TransactionDate
        };
    }
    }