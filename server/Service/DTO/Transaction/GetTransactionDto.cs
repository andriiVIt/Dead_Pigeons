namespace Service.DTO.Transaction;
using DataAccess.models;
public class GetTransactionDto
{
    public Guid Id { get; set; }
    public Guid PlayerId { get; set; }
    public decimal Amount { get; set; }
    public string MobilePayTransactionId { get; set; } = string.Empty;

    public static GetTransactionDto FromEntity( Transaction transaction)
    {
        return new GetTransactionDto
        {
            Id = transaction.Id,
            PlayerId = transaction.PlayerId,
            Amount = transaction.Amount,
            MobilePayTransactionId = transaction.MobilePayTransactionId
        };
    }
}