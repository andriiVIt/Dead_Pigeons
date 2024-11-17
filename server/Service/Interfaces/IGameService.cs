using Service.DTO.Game;

namespace Service.Interfaces;

 

public interface IGameService
{
    GetGameDto CreateGame(CreateGameDto createGameDto);
    GetGameDto UpdateGame(Guid id, UpdateGameDto updateGameDto);
    List<GetGameDto> GetAllGames(int limit, int startAt);
    GetGameDto? GetGameById(Guid id);
    bool DeleteGame(Guid id);
    CheckWinnerResponseDto CheckForWinner(Guid gameId, Guid playerId);
}