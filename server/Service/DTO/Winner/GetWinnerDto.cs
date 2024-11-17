namespace Service.DTO.Winner;

using DataAccess.models;

public class GetWinnerDto
{
    public Guid Id { get; set; }
    public Guid GameId { get; set; }
    public Guid PlayerId { get; set; }
    public decimal PrizeAmount { get; set; }
    public string PlayerName { get; set; } = string.Empty;
    public DateTime GameStartDate { get; set; }

    public static GetWinnerDto FromEntity(Winner winner)
    {
        return new GetWinnerDto
        {
            Id = winner.Id,
            GameId = winner.GameId,
            PlayerId = winner.PlayerId,
            PrizeAmount = winner.PrizeAmount,
            PlayerName = winner.Player.Name,
            GameStartDate = winner.Game.StartDate
        };
    }
}