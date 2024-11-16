using DataAccess.models;
using Service.Game;

namespace Service.Interfaces;

public interface IGameService
{
    Task<IEnumerable<GetGameDto>> GetAllAsync();
    Task<GetGameDto?> GetByIdAsync(Guid id);
    Task<GetGameDto> CreateAsync(CreateGameDto dto);
    Task<bool> UpdateAsync(Guid id, UpdateGameDto dto);
    Task<bool> DeleteAsync(Guid id);
}