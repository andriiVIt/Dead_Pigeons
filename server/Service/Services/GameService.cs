using DataAccess.models;

namespace Service.Services;

using DataAccess;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Service.DTO.Game;
using Service.Interfaces;

public class GameService(
    AppDbContext context,
    IValidator<CreateGameDto> createGameValidator,
    IValidator<UpdateGameDto> updateGameValidator
) : IGameService
{
    public GetGameDto CreateGame(CreateGameDto createGameDto)
    {
        createGameValidator.ValidateAndThrow(createGameDto);

        var game = CreateGameDto.ToEntity(createGameDto);
        context.Games.Add(game);
        context.SaveChanges();

        return GetGameDto.FromEntity(game);
    }

    public GetGameDto UpdateGame(Guid id, UpdateGameDto updateGameDto)
    {
        updateGameValidator.ValidateAndThrow(updateGameDto);

        var game = context.Games.FirstOrDefault(g => g.Id == id);
        if (game == null) throw new KeyNotFoundException("Game not found.");

        updateGameDto.UpdateEntity(game);
        context.Games.Update(game);
        context.SaveChanges();

        return GetGameDto.FromEntity(game);
    }

    public List<GetGameDto> GetAllGames(int limit, int startAt)
    {
        var games = context.Games
            .OrderBy(g => g.StartDate)
            .Skip(startAt)
            .Take(limit)
            .ToList();

        return games.Select(GetGameDto.FromEntity).ToList();
    }

    public GetGameDto? GetGameById(Guid id)
    {
        var game = context.Games.FirstOrDefault(g => g.Id == id);
        return game == null ? null : GetGameDto.FromEntity(game);
    }

    public bool DeleteGame(Guid id)
    {
        var game = context.Games.FirstOrDefault(g => g.Id == id);
        if (game == null) return false;

        context.Games.Remove(game);
        context.SaveChanges();
        return true;
    }
    public CheckWinnerResponseDto CheckForWinner(Guid gameId, Guid playerId)
    {
        // Отримати гру
        var game = context.Games
            .Include(g => g.Boards)
            .ThenInclude(b => b.Player)
            .FirstOrDefault(g => g.Id == gameId);

        if (game == null)
        {
            throw new KeyNotFoundException("Game not found.");
        }

        // Отримати комбінацію чисел гравця
        var board = game.Boards.FirstOrDefault(b => b.PlayerId == playerId);

        if (board == null)
        {
            throw new KeyNotFoundException("Board for player not found.");
        }

        // Перевірити, чи виграв гравець
        bool isWinner = board.Numbers.SequenceEqual(game.WinningSequence);

        if (isWinner)
        {
            // Створити запис про переможця
            var prizeAmount = CalculatePrizeAmount(gameId); // Метод для розрахунку виграшу
            var winner = new DataAccess.models.Winner
            {
                Id = Guid.NewGuid(),
                GameId = gameId,
                PlayerId = playerId,
                WinningAmount = prizeAmount
            };

            context.Winners.Add(winner);
            context.SaveChanges();

            return new CheckWinnerResponseDto
            {
                IsWinner = true,
                PrizeAmount = prizeAmount
            };
        }

        return new CheckWinnerResponseDto
        {
            IsWinner = false,
            PrizeAmount = 0
        };
    }

    private decimal CalculatePrizeAmount(Guid gameId)
    {
        var totalBets = context.Transactions
            .Where(t => context.Boards
                .Where(b => b.GameId == gameId)
                .Select(b => b.PlayerId)
                .Contains(t.PlayerId))
            .Sum(t => t.Amount);

        return totalBets * 0.8m; // 80% від ставок як приз
    }
}
