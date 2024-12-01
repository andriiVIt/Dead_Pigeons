namespace Service.DTO.Transaction;
using DataAccess.models;
public class CreateTransactionDto
{
    public Guid PlayerId { get; set; }
    public decimal Amount { get; set; }
    public string MobilePayTransactionId { get; set; } = string.Empty;

    public static  Transaction ToEntity(CreateTransactionDto сreateTransactionDto )
    {
        return new  Transaction
        {
            Id = Guid.NewGuid(),
            PlayerId = сreateTransactionDto.PlayerId,
            Amount = сreateTransactionDto.Amount,
            MobilePayTransactionId = сreateTransactionDto.MobilePayTransactionId,
            TransactionDate = DateTime.UtcNow 
        };
    }
}