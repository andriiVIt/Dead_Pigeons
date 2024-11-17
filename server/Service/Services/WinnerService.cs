using DataAccess;
using DataAccess.models;
using Microsoft.EntityFrameworkCore;
using Service.DTO.Game;
using Service.Interfaces;
using Service.DTO.Winner;
using DataAccess.models;
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

    // public CheckWinnerResponseDto CheckForWinner(Guid gameId, Guid playerId)
    // {
    //     var game = _context.Games
    //         .Include(g => g.WinningSequence)
    //         .Include(g => g.Boards)
    //         .FirstOrDefault(g => g.Id == gameId);
    //
    //     if (game == null)
    //         throw new KeyNotFoundException("Game not found.");
    //
    //     var playerBoard = _context.Boards
    //         .FirstOrDefault(b => b.GameId == gameId && b.PlayerId == playerId);
    //
    //     if (playerBoard == null)
    //         throw new KeyNotFoundException("Player's board not found.");
    //
    //     if (!playerBoard.Numbers.SequenceEqual(game.WinningSequence))
    //         return new CheckWinnerResponseDto
    //         {
    //             IsWinner = false,
    //             PrizeAmount = 0
    //         };
    //
    //     var prizeAmount = CalculatePrizeAmount(gameId);
    //
    //     var winner = new DataAccess.models.Winner
    //     {
    //         Id = Guid.NewGuid(),
    //         GameId = gameId,
    //         PlayerId = playerId,
    //         PrizeAmount = prizeAmount
    //     };
    //
    //     _context.Winners.Add(winner);
    //     _context.SaveChanges();
    //
    //     return new CheckWinnerResponseDto
    //     {
    //         IsWinner = true,
    //         PrizeAmount = prizeAmount
    //     };
    // }

    public GetWinnerDto? GetWinnerById(Guid winnerId)
    {
        var winner = _context.Winners
            .Include(w => w.Player)
            .Include(w => w.Game)
            .FirstOrDefault(w => w.Id == winnerId);

        return winner == null ? null : GetWinnerDto.FromEntity(winner);
    }

    // private decimal CalculatePrizeAmount(Guid gameId)
    // {
    //     var totalBets = context.Transactions
    //         .Where(t => context.Boards
    //             .Where(b => b.GameId == gameId)
    //             .Select(b => b.PlayerId)
    //             .Contains(t.PlayerId))
    //         .Sum(t => t.Amount);
    //
    //     return totalBets * 0.8m; // 80% від ставок як приз
    // }
}
