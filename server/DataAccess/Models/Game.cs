namespace DataAccess.models;

public class Game
{
    public Guid Id { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public List<int> WinningSequence { get; set; } = new();

    public List<Board> Boards { get; set; } = new();
    public List<Winner> Winners { get; set; } = new();
}