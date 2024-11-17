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
        var board = CreateBoardDto.ToEntity(createBoardDto);

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