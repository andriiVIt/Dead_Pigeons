namespace Service.DTO.Transaction;
using DataAccess.models;
public class UpdateTransactionDto
{
    public decimal Amount { get; set; }
    public string MobilePayTransactionId { get; set; } = string.Empty;

    public void UpdateEntity( Transaction transaction)
    {
        transaction.Amount = Amount;
        transaction.MobilePayTransactionId = MobilePayTransactionId;
        transaction.TransactionDate = DateTime.UtcNow;
    }
}