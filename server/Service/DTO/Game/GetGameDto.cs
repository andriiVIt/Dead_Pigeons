namespace Service.DTO.Game;

using DataAccess.models;

public class GetGameDto
{
    public Guid Id { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public List<int> WinningSequence { get; set; } = new();

    public static GetGameDto FromEntity(Game game)
    {
        return new GetGameDto
        {
            Id = game.Id,
            StartDate = game.StartDate,
            EndDate = game.EndDate,
            WinningSequence = game.WinningSequence
        };
    }
}