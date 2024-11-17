namespace Service.DTO.Player;
 using DataAccess.models;
public class GetPlayerDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Balance { get; set; }
    public bool IsActive { get; set; }
    public string UserId { get; set; }

    // Мапінг з сутності в DTO
    public static GetPlayerDto FromEntity(Player player)
    {
        return new GetPlayerDto
        {
            Id = player.Id,
            Name = player.Name,
            Balance = player.Balance,
            IsActive = player.IsActive,
            UserId = player.UserId
        };
    }

    
}