

namespace Service.DTO.Player;

 using DataAccess.models;
 
public class CreatePlayerDto
{
    public string Name { get; set; }
    public decimal Balance { get; set; }
    public bool IsActive { get; set; }
    public string UserId { get; set; }

    public static Player ToEntity(CreatePlayerDto createPlayerDto)
    {
        return new Player
        {
            Id = Guid.NewGuid(),
            Name = createPlayerDto.Name,
            Balance = createPlayerDto.Balance,
            IsActive = createPlayerDto.IsActive,
            UserId = createPlayerDto.UserId
        };
    }
}