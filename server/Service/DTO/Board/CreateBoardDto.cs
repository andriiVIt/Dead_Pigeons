namespace Service.DTO.Board;


using DataAccess.models;
public class CreateBoardDto
{
    public Guid PlayerId { get; set; }
    public Guid GameId { get; set; }
    public List<int> Numbers { get; set; } = new();

    public static  Board ToEntity(CreateBoardDto dto)
    {
        return new Board
        {
            Id = Guid.NewGuid(),
            PlayerId = dto.PlayerId,
            GameId = dto.GameId,
            Numbers = dto.Numbers
        };
    }
}