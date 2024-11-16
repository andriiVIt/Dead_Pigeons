namespace Service;

public class WinnerDto
{
    public Guid Id { get; set; }
    public Guid PlayerId { get; set; }
    public Guid GameId { get; set; }
    public decimal PrizeAmount { get; set; }
}