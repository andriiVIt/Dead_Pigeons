namespace Service.DTO.Game;

using DataAccess.models;

public class UpdateGameDto
{
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public List<int> WinningSequence { get; set; } = new();

    public void UpdateEntity(Game game)
    {
        game.StartDate = StartDate;
        game.EndDate = EndDate;
        game.WinningSequence = WinningSequence;
    }
}