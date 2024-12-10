using System.Text.Json.Serialization;

namespace DataAccess.models;

public class Board
{
    public Guid Id { get; set; }
    public Guid PlayerId { get; set; }
    public Guid GameId { get; set; }
    public List<int> Numbers { get; set; } = new(); // Ініціалізація списку
    
    public decimal Price { get; set; } // Ціна дошки
    
    public Player Player { get; set; } = null!;
    
    public Game Game { get; set; } = null!;
}