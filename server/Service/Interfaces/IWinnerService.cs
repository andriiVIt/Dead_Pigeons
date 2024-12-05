using Service.DTO.Game;


namespace Service.Interfaces;

public interface IWinnerService
{
    /// <summary>
    /// Отримує список переможців для конкретної гри.
    /// </summary>
    /// <param name="gameId">Ідентифікатор гри.</param>
    /// <returns>Список DTO переможців.</returns>
    List<GetWinnerDto> GetWinnersByGame(Guid gameId);

    /// <summary>
    /// Перевіряє, чи є гравець переможцем у грі, і створює запис про переможця.
    /// </summary>
    /// <param name="gameId">Ідентифікатор гри.</param>
    /// <param name="playerId">Ідентифікатор гравця.</param>
    /// <returns>Результат перевірки у вигляді DTO.</returns>
    CheckWinnerResponseDto CheckForWinner(Guid gameId, Guid playerId);

    /// <summary>
    /// Отримує детальну інформацію про конкретного переможця.
    /// </summary>
    /// <param name="winnerId">Ідентифікатор переможця.</param>
    /// <returns>DTO переможця або null, якщо не знайдено.</returns>
    GetWinnerDto? GetWinnerById(Guid winnerId);

     
}