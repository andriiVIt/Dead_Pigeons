namespace Service.DTO.Board;


using DataAccess.models;
public class GetBoardDto
{
    public Guid Id { get; set; }
    public Guid PlayerId { get; set; }
    public Guid GameId { get; set; }
    public List<int> Numbers { get; set; } = new();
    public decimal Price { get; set; }  

    public static GetBoardDto FromEntity(Board board)
    {
        return new GetBoardDto
        {
            Id = board.Id,
            PlayerId = board.PlayerId,
            GameId = board.GameId,
            Numbers = board.Numbers,
            Price = board.Price // Transfer the calculated price
        };
    }
}