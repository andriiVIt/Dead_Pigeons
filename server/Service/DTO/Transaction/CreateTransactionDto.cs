namespace Service.Transaction;

public class CreateTransactionDto
{
    public Guid PlayerId { get; set; }
    public decimal Amount { get; set; }
    public string MobilePayTransactionId { get; set; }
}