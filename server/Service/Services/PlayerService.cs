using DataAccess;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Service.Interfaces;
using Service.DTO.Player;

namespace Service;

public class PlayerService : IPlayerService
{
    private readonly ILogger<PlayerService> _logger;
    private readonly IValidator<CreatePlayerDto> _createPlayerValidator;
    private readonly IValidator<UpdatePlayerDto> _updatePlayerValidator;
    private readonly AppDbContext _context;

    public PlayerService(
        ILogger<PlayerService> logger,
        IValidator<CreatePlayerDto> createPlayerValidator,
        IValidator<UpdatePlayerDto> updatePlayerValidator,
        AppDbContext context)
    {
        _logger = logger;
        _createPlayerValidator = createPlayerValidator;
        _updatePlayerValidator = updatePlayerValidator;
        _context = context;
    }

    public GetPlayerDto CreatePlayer(CreatePlayerDto createPlayerDto)
    {
        _createPlayerValidator.ValidateAndThrow(createPlayerDto);

        if (!_context.Users.Any(u => u.Id == createPlayerDto.UserId))
        {
            throw new ArgumentException("UserId does not exist.");
        }

        var player = CreatePlayerDto.ToEntity(createPlayerDto);

        _context.Players.Add(player);
        _context.SaveChanges();

        return GetPlayerDto.FromEntity(player);
    }

    public GetPlayerDto UpdatePlayer(Guid id, UpdatePlayerDto updatePlayerDto)
    {
        _updatePlayerValidator.ValidateAndThrow(updatePlayerDto);

        var player = _context.Players.FirstOrDefault(p => p.Id == id);
        if (player == null)
        {
            throw new KeyNotFoundException("Player not found.");
        }

        player.Name = updatePlayerDto.Name;
        player.Balance = updatePlayerDto.Balance;
        player.IsActive = updatePlayerDto.IsActive;

        _context.Players.Update(player);
        _context.SaveChanges();

        return GetPlayerDto.FromEntity(player);
    }

    public List<GetPlayerDto> GetAllPlayers(int limit, int startAt)
    {
        var players = _context.Players.OrderBy(p => p.Id).Skip(startAt).Take(limit).ToList();

        return players.Select(GetPlayerDto.FromEntity).ToList();
    }

    public GetPlayerDto GetPlayerById(Guid id)
    {
        var player = _context.Players.FirstOrDefault(p => p.Id == id);
        return player == null ? null : GetPlayerDto.FromEntity(player);
    }

    public bool DeletePlayer(Guid id)
    {
        var player = _context.Players.FirstOrDefault(p => p.Id == id);
        if (player == null)
        {
            return false;
        }

        _context.Players.Remove(player);
        _context.SaveChanges();
        return true;
    }
}
