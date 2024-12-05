namespace Service.DTO.Board;

public class CreateBoardDto
{
    public Guid PlayerId { get; set; }
    public Guid GameId { get; set; }
    public List<int> Numbers { get; set; } = new();

    public static DataAccess.models.Board
         ToEntity(CreateBoardDto dto)
    {
        return new DataAccess.models.Board
        {
            PlayerId = dto.PlayerId,
            GameId = dto.GameId,
            Numbers = dto.Numbers,
            Price = CalculatePrice(dto.Numbers.Count) // Обчислюємо ціну
        };
    }

    private static decimal CalculatePrice(int numberCount)
    {
        return numberCount switch
        {
            5 => 20m,
            6 => 40m,
            7 => 80m,
            8 => 160m,
            _ => throw new ArgumentException("Invalid number count. Must be between 5 and 8.")
        };
    }
}