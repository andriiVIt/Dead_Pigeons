using DataAccess.models;
using Service.Player;

namespace Service.Interfaces;

public interface IPlayerService
{
    Task<IEnumerable<GetPlayerDto>> GetAllAsync();
    Task<GetPlayerDto?> GetByIdAsync(Guid id);
    Task<GetPlayerDto> CreatePlayerAsync(CreatePlayerDto createPlayerDto);
    Task<bool> UpdateAsync(Guid id, UpdatePlayerDto updatePlayerDto);
    Task<bool> DeleteAsync(Guid id);
}