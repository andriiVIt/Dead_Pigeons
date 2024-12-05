using DataAccess;
using DataAccess.models;
using Microsoft.EntityFrameworkCore;
using Service.DTO.Board;
using Service.Interfaces;

namespace Service.Services;

public class BoardService : IBoardService
{
    private readonly AppDbContext _context;

    public BoardService(AppDbContext context)
    {
        _context = context;
    }

    public GetBoardDto CreateBoard(CreateBoardDto createBoardDto)
    {
        // Перевірка: чи існує гравець
        var player = _context.Players.Find(createBoardDto.PlayerId);
        if (player == null)
            throw new KeyNotFoundException("Player not found.");

        // Перевірка: чи вистачає коштів
        int numberCount = createBoardDto.Numbers.Count;
        decimal price = numberCount switch
        {
            5 => 20m,
            6 => 40m,
            7 => 80m,
            8 => 160m,
            _ => throw new ArgumentException("Invalid number count.")
        };

        if (player.Balance < price)
            throw new InvalidOperationException("Insufficient balance.");

        // Зменшення балансу гравця
        player.Balance -= price;
        _context.Players.Update(player);
        // Створення дошки
        var board = new Board
        {
            Id = Guid.NewGuid(),
            PlayerId = createBoardDto.PlayerId,
            GameId = createBoardDto.GameId,
            Numbers = createBoardDto.Numbers,
            Price = price
        };

        _context.Boards.Add(board);
        _context.SaveChanges();

        return GetBoardDto.FromEntity(board);
    }

    public GetBoardDto UpdateBoard(Guid id, UpdateBoardDto updateBoardDto)
    {
        var board = _context.Boards.Find(id) ?? throw new KeyNotFoundException("Board not found.");
        UpdateBoardDto.UpdateEntity(board,updateBoardDto);

        _context.Boards.Update(board);
        _context.SaveChanges();

        return GetBoardDto.FromEntity(board);
    }

    public GetBoardDto? GetBoardById(Guid id)
    {
        var board = _context.Boards.Find(id);
        return board == null ? null : GetBoardDto.FromEntity(board);
    }

    public List<GetBoardDto> GetAllBoards(int limit, int startAt)
    {
        var boards = _context.Boards
            .OrderBy(b => b.Id)
            .Skip(startAt)
            .Take(limit)
            .ToList();

        return boards.Select(GetBoardDto.FromEntity).ToList();
    }

    public bool DeleteBoard(Guid id)
    {
        var board = _context.Boards.Find(id);
        if (board == null) return false;

        _context.Boards.Remove(board);
        _context.SaveChanges();

        return true;
    }
}