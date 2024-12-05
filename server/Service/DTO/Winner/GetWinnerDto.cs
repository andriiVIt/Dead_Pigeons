using DataAccess.models;

public class GetWinnerDto
{
    public Guid Id { get; set; }
    public Guid GameId { get; set; }
    
    public Guid PlayerId { get; set; }
    public string PlayerName { get; set; } = string.Empty;
    public decimal WinningAmount { get; set; }
    
    public DateTime GameStartDate { get; set; }
    public DateTime GameEndDate { get; set; }

    public static GetWinnerDto FromEntity(Winner winner)
    {
        return new GetWinnerDto
        {
            Id = winner.Id,
            GameId = winner.GameId,
            
            PlayerId = winner.PlayerId,
            PlayerName = winner.Player.Name,
            WinningAmount = winner.WinningAmount,
            GameStartDate = winner.Game.StartDate,
            GameEndDate = winner.Game.EndDate ?? DateTime.MinValue 
        };
    }
}