namespace DataAccess.models;

public class Winner
{
    public Guid Id { get; set; }
    public Guid GameId { get; set; }
    public Guid PlayerId { get; set; }
    public decimal PrizeAmount { get; set; }

    
    public Game Game { get; set; }
    public Player Player { get; set; }
}