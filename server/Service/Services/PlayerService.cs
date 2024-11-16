using DataAccess;
using DataAccess.models;
using Microsoft.EntityFrameworkCore;
using Service.Interfaces;
using Service.Player;

namespace Service.Services;

public class PlayerService : IPlayerService
{
    private readonly AppDbContext _context;

    public PlayerService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<GetPlayerDto>> GetAllAsync()
    {
        var players = await _context.Players.ToListAsync();
        return players.Select(GetPlayerDto.FromEntity);
    }

    public async Task<GetPlayerDto?> GetByIdAsync(Guid id)
    {
        var player = await _context.Players.FindAsync(id);
        return player == null ? null : GetPlayerDto.FromEntity(player);
    }

    public async Task<GetPlayerDto> CreatePlayerAsync(CreatePlayerDto createPlayerDto)
    {
        // Перевіряємо, чи існує користувач із вказаним UserId
        var userExists = await _context.Users.AnyAsync(u => u.Id == createPlayerDto.UserId);
        if (!userExists)
        {
            throw new ArgumentException("UserId does not exist.");
        }

        // Перетворення DTO -> Entity
        var player = CreatePlayerDto.ToEntity(createPlayerDto);

        // Додавання нового гравця до бази даних
        _context.Players.Add(player);
        await _context.SaveChangesAsync();

        // Перетворення Entity -> DTO для відповіді
        return GetPlayerDto.FromEntity(player);
    }


    public async Task<bool> UpdateAsync(Guid id, UpdatePlayerDto updatePlayerDto)
    {
        var player = await _context.Players.FindAsync(id);
        if (player == null) return false;

        _context.Players.Update(player);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var player = await _context.Players.FindAsync(id);
        if (player == null) return false;

        _context.Players.Remove(player);
        await _context.SaveChangesAsync();
        return true;
    }
}