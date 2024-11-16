namespace Service.Board;

public class CreateBoardDto
{
    public Guid PlayerId { get; set; }
    public Guid GameId { get; set; }
    public List<int> Numbers { get; set; }
}