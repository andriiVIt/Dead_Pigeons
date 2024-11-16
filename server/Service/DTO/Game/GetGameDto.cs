namespace Service.Game;

public class GetGameDto
{
    public Guid Id { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public List<int> WinningSequence { get; set; }
}