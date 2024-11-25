using Service.DTO.Player;
 

namespace Service.Interfaces;

public interface IPlayerService
{
    // GetPlayerDto CreatePlayer(CreatePlayerDto createPlayerDto);
    GetPlayerDto UpdatePlayer(Guid id, UpdatePlayerDto updatePlayerDto);
    List<GetPlayerDto> GetAllPlayers(int limit, int startAt);
    GetPlayerDto GetPlayerById(Guid id);
    bool DeletePlayer(Guid id);
}