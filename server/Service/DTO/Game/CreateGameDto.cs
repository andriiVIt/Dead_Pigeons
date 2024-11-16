namespace Service.Game;

public class CreateGameDto
{
    public DateTime StartDate { get; set; }
    public List<int> WinningSequence { get; set; }
}