namespace Service.DTO.Game;

using DataAccess.models;

public class CreateGameDto
{
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public List<int> WinningSequence { get; set; } = new();

    public static Game ToEntity(CreateGameDto dto)
    {
        return new Game
        {
            Id = Guid.NewGuid(),
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            WinningSequence = dto.WinningSequence
        };
    }
}