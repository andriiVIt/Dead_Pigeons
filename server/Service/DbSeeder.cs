using DataAccess;
using DataAccess.Entities;
using DataAccess.models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Service;

public class DbSeeder
{
    private readonly ILogger<DbSeeder> logger;
    private readonly AppDbContext context;
    private readonly UserManager<User> userManager;
    private readonly RoleManager<IdentityRole> roleManager;

    public DbSeeder(
        ILogger<DbSeeder> logger,
        AppDbContext context,
        UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager
    )
    {
        this.logger = logger;
        this.context = context;
        this.userManager = userManager;
        this.roleManager = roleManager;
    }

    public async Task SeedAsync()
    {
        await context.Database.EnsureCreatedAsync();

        await CreateRoles(Role.Admin, Role.Player);
        await CreateUser(username: "admin@example.com", password: "S3cret!", role: Role.Admin);
        await CreateUser(username: "reader@example.com", password: "S3cret!", role: Role.Player);

        await context.SaveChangesAsync();
    }

    private async Task CreateRoles(params string[] roles)
    {
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }

    private async Task CreateUser(string username, string password, string role)
    {
        if (await userManager.FindByNameAsync(username) != null) return;
        var user = new User
        {
            UserName = username,
            Email = username,
            EmailConfirmed = true
        };
        var result = await userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                logger.LogWarning("{Code}: {Description}", error.Code, error.Description);
            }
        }
        await userManager.AddToRoleAsync(user, role);
    }
}
