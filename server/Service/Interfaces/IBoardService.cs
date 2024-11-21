using Service.DTO.Board;
 

namespace Service.Interfaces;

public interface IBoardService
{
    GetBoardDto CreateBoard(CreateBoardDto dto);
    GetBoardDto UpdateBoard(Guid id, UpdateBoardDto dto);
    GetBoardDto? GetBoardById(Guid id);
    List<GetBoardDto> GetAllBoards(int limit, int startAt);
    bool DeleteBoard(Guid id);
}