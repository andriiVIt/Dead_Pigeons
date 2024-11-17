namespace Service.DTO.Transaction;
using DataAccess.models;
public class CreateTransactionDto
{
    public Guid PlayerId { get; set; }
    public decimal Amount { get; set; }
    public string MobilePayTransactionId { get; set; } = string.Empty;

    public static  Transaction ToEntity(CreateTransactionDto dto)
    {
        return new  Transaction
        {
            Id = Guid.NewGuid(),
            PlayerId = dto.PlayerId,
            Amount = dto.Amount,
            MobilePayTransactionId = dto.MobilePayTransactionId
        };
    }
}