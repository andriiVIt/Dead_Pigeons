using Service.DTO.Winner;
 

namespace Service.Interfaces;
 
 



public interface IWinnerService
{
   
    List<GetWinnerDto> GetWinnersByGame(Guid gameId);

    // CheckWinnerResponseDto CheckForWinner(Guid gameId, Guid playerId);

   
    GetWinnerDto? GetWinnerById(Guid winnerId);
}