using Microsoft.AspNetCore.Identity;

namespace DataAccess.models;

public class User : IdentityUser
{
    public List<Player> Players { get; set; } = new();
}