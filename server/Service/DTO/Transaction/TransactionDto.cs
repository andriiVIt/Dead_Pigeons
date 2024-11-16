namespace Service.Transaction;

public class TransactionDto
{
    public Guid Id { get; set; }
    public Guid PlayerId { get; set; }
    public decimal Amount { get; set; }
    public string MobilePayTransactionId { get; set; }

}