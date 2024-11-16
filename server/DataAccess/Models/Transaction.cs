namespace DataAccess.models;

public class Transaction
{
    public Guid Id { get; set; }
    public Guid PlayerId { get; set; }
    public decimal Amount { get; set; }
    public string MobilePayTransactionId { get; set; } = string.Empty;

    public Player Player { get; set; } = null!;
}