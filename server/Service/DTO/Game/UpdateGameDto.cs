namespace Service.Game;

public class UpdateGameDto
{
    public DateTime? EndDate { get; set; }
    public List<int> WinningSequence { get; set; }
}