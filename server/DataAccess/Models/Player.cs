using DataAccess.models;

namespace DataAccess.models;

public class Player
{
    public Guid Id { get; set; }
    public string UserId { get; set; }
    public string Name { get; set; }
    public decimal Balance { get; set; }
    public bool IsActive { get; set; }

    public User User { get; set; }

    // Додати цю властивість
    public List<Board> Boards { get; set; } = new();
    public List<Transaction> Transactions { get; set; } = new();
    
}