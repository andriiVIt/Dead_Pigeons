using DataAccess.models;
using Service.Board;

namespace Service.Interfaces;

public interface IBoardService
{
    Task<IEnumerable<GetBoardDto>> GetAllAsync();
    Task<GetBoardDto?> GetByIdAsync(Guid id);
    Task<GetBoardDto> CreateAsync(CreateBoardDto dto);
    // Task<bool> UpdateAsync(Guid id, UpdateBoardDto dto);
    Task<bool> DeleteAsync(Guid id);
}