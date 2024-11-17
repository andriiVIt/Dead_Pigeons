namespace Service.DTO.Board;
using DataAccess.models;
public class UpdateBoardDto
{
    public List<int> Numbers { get; set; } = new();

    public static void UpdateEntity(Board board, UpdateBoardDto dto)
    {
        board.Numbers = dto.Numbers;
    }
}