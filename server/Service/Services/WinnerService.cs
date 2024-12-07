using DataAccess;
using DataAccess.models;
using Microsoft.EntityFrameworkCore;
using Service.DTO.Game;
using Service.Interfaces;

 
namespace Service.Services;

public class WinnerService : IWinnerService
{
    private readonly AppDbContext _context;

    public WinnerService(AppDbContext context)
    {
        _context = context;
    }

    public List<GetWinnerDto> GetWinnersByGame(Guid gameId)
    {
        var winners = _context.Winners
            .Include(w => w.Player)
            .Include(w => w.Game)
            .Where(w => w.GameId == gameId)
            .ToList();

        return winners.Select(GetWinnerDto.FromEntity).ToList();
    }

    public CheckWinnerResponseDto CheckForWinner(Guid gameId, Guid playerId)
    {
        var game = _context.Games
            .Include(g => g.Boards)
            .FirstOrDefault(g => g.Id == gameId);

        if (game == null)
            throw new KeyNotFoundException("Game not found.");

        Console.WriteLine($"Winning Sequence: {string.Join(", ", game.WinningSequence)}");

        foreach (var board in game.Boards)
        {
            Console.WriteLine($"Board Numbers for Player {board.PlayerId}: {string.Join(", ", board.Numbers)}");
        }

        var player = _context.Players.Find(playerId);
        if (player == null)
            throw new KeyNotFoundException("Player not found.");
        var winningBoards = game.Boards
            .Where(b => game.WinningSequence.All(n => b.Numbers.Contains(n)))
            .ToList();

        Console.WriteLine($"Number of Winning Boards: {winningBoards.Count}");

        if (!winningBoards.Any())
            return new CheckWinnerResponseDto { IsWinner = false, PrizeAmount = 0 };

        decimal totalPrize = CalculatePrizeAmount(gameId);
        decimal individualPrize = totalPrize / winningBoards.Count;

        foreach (var board in winningBoards)
        {
            AddPrizeToPlayerBalance(board.PlayerId, individualPrize);

            var winner = new Winner
            {
                Id = Guid.NewGuid(),
                GameId = gameId,
                PlayerId = board.PlayerId,
                WinningAmount = individualPrize
            };

            _context.Winners.Add(winner);
        }

        _context.SaveChanges();

        return new CheckWinnerResponseDto { IsWinner = true, PrizeAmount = individualPrize };
    }

    public GetWinnerDto? GetWinnerById(Guid winnerId)
    {
        var winner = _context.Winners
            .Include(w => w.Player)
            .Include(w => w.Game)
            .FirstOrDefault(w => w.Id == winnerId);

        return winner == null ? null : GetWinnerDto.FromEntity(winner);
    }

    private decimal CalculatePrizeAmount(Guid gameId)
    {
        var totalRevenue = _context.Boards
            .Where(b => b.GameId == gameId)
            .Sum(b => b.Price);

        decimal prizePool = totalRevenue * 0.7m; // 70% йде на призовий фонд
        return prizePool;
    }
    private void AddPrizeToPlayerBalance(Guid playerId, decimal prize)
    {
        var player = _context.Players.FirstOrDefault(p => p.Id == playerId);
        if (player != null)
        {
            if (string.IsNullOrWhiteSpace(player.UserId))
            {
                throw new InvalidOperationException($"Player {playerId} does not have a valid UserId.");
            }

            player.Balance += prize;
            _context.Entry(player).State = EntityState.Modified;
        }
        else
        {
            throw new KeyNotFoundException($"Player with ID {playerId} not found.");
        }
    }
    public List<GetWinnerDto> GetWinnersByPlayer(Guid playerId)
    {
        var winners = _context.Winners
            .AsNoTracking()
            .Where(w => w.PlayerId == playerId)
            .Select(w => new GetWinnerDto
            {
                Id = w.Id,
                GameId = w.GameId,
                PlayerId = w.PlayerId,
                PlayerName = w.Player.Name,
                WinningAmount = w.WinningAmount,
                GameStartDate = w.Game.StartDate,
                 
            })
            .ToList();

        return winners;
    }
}
