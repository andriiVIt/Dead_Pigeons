namespace Service.Player;
using DataAccess.models;
public class UpdatePlayerDto
{
    public string Name { get; set; }
    public decimal Balance { get; set; }
    public bool IsActive { get; set; }
    
    
        public static Player ToEntity(UpdatePlayerDto updatePlayerDto)
        {
            return new Player
            {
                Name = updatePlayerDto.Name,
                Balance = updatePlayerDto.Balance,
                IsActive = updatePlayerDto.IsActive,
            };
        }
}