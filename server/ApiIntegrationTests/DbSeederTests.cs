using DataAccess;
using DataAccess.models;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Service;

public class DbSeederTests : ApiTestBase
{
    [Fact]
    public async Task SeedAsync_ShouldCreateRolesAndUsers()
    {
        // Act
        using (var scope = ApplicationServices.CreateScope())
        {
            var seeder = scope.ServiceProvider.GetRequiredService<DbSeeder>();
            await seeder.SeedAsync();
        }

        // Assert
        using (var scope = ApplicationServices.CreateScope())
        {
            var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

            // Checking roles
            (await roleManager.RoleExistsAsync(Role.Admin)).Should().BeTrue();
            (await roleManager.RoleExistsAsync(Role.Player)).Should().BeTrue();

            // Validate users
            var admin = await userManager.FindByNameAsync("admin@example.com");
            admin.Should().NotBeNull();
            (await userManager.IsInRoleAsync(admin, Role.Admin)).Should().BeTrue();

            var player = await userManager.FindByNameAsync("reader@example.com");
            player.Should().NotBeNull();
            (await userManager.IsInRoleAsync(player, Role.Player)).Should().BeTrue();
        }
    }
}