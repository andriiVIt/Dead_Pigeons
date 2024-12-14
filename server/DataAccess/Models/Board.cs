using System.Text.Json.Serialization;

namespace DataAccess.models;

public class Board
{
    public Guid Id { get; set; }
    public Guid PlayerId { get; set; }
    public Guid GameId { get; set; }
    public List<int> Numbers { get; set; } = new(); // Initialize the list
    
    public decimal Price { get; set; }  
    
    public Player Player { get; set; } = null!;
    
    public Game Game { get; set; } = null!;
}