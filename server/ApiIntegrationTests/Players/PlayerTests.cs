 using System;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using DataAccess;
using DataAccess.models;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Service.DTO.Player;
using Xunit;

public class PlayerTests : ApiTestBase
{
     
    [Fact]
    public async Task UpdatePlayer_ShouldReturnUpdatedPlayer()
    {
        // Arrange
        var userManager = ApplicationServices.GetRequiredService<UserManager<User>>();
        var user = new User
        {
            UserName = "testplayer@example.com",
            Email = "testplayer@example.com",
            EmailConfirmed = true
        };

        var createUserResult = await userManager.CreateAsync(user, "Test123!");
        if (!createUserResult.Succeeded)
        {
            throw new Exception($"Failed to create user: {string.Join(", ", createUserResult.Errors.Select(e => e.Description))}");
        }

        var playerId = Guid.NewGuid();
        var updateDto = new UpdatePlayerDto
        {
            Name = "Updated Player",
            Balance = 200,
            IsActive = true
        };

        using (var scope = ApplicationServices.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var testPlayer = new Player
            {
                Id = playerId,
                UserId = user.Id, // We use the correct UserId
                Name = "Player to Update",
                Balance = 50.00m,
                IsActive = true
            };
            dbContext.Players.Add(testPlayer);
            await dbContext.SaveChangesAsync();
        }

        Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _jwtToken);

        // Act
        var response = await Client.PutAsJsonAsync($"/api/player/{playerId}", updateDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK); // Expect 200
        var updatedPlayer = await response.Content.ReadFromJsonAsync<GetPlayerDto>();
        updatedPlayer.Name.Should().Be(updateDto.Name);
        updatedPlayer.Balance.Should().Be(updateDto.Balance);
        updatedPlayer.IsActive.Should().Be(updateDto.IsActive);
    }

    [Fact]
    public async Task DeletePlayer_ShouldReturnNoContent()
    {
        // Arrange: create a test user
        var userManager = ApplicationServices.GetRequiredService<UserManager<User>>();
        var user = new User
        {
            UserName = "testplayer@example.com",
            Email = "testplayer@example.com",
            EmailConfirmed = true
        };

        await userManager.CreateAsync(user, "Test123!");

        // Create test player
        var player = new Player
        {
            UserId = user.Id, // We use the ID of the created user
            Name = "Player to Delete",
            Balance = 50.00m,
            IsActive = true
        };

        using (var scope = ApplicationServices.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            dbContext.Players.Add(player);
            await dbContext.SaveChangesAsync();
        }

        // Add the authorization token
        Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _jwtToken);

        // Act: remove the player
        var response = await Client.DeleteAsync($"/api/player/{player.Id}");

        // Assert: we check that the response status is 204 NoContent
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        using (var scope = ApplicationServices.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var deletedPlayer = dbContext.Players.FirstOrDefault(p => p.Id == player.Id);
            deletedPlayer.Should().BeNull(); // Гравець має бути видаленим
        }
    }
    [Fact]
    public async Task DeletePlayer_ShouldReturnNotFound_WhenPlayerDoesNotExist()
    {
        // Arrange
        var nonExistentPlayerId = Guid.NewGuid();

        Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _jwtToken);

        // Act
        var response = await Client.DeleteAsync($"/api/player/{nonExistentPlayerId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

     

    [Fact]
    public async Task DeletePlayer_ShouldReturnUnauthorized_WhenNotAuthorized()
    {
        // Arrange: create a test user and player
        var userManager = ApplicationServices.GetRequiredService<UserManager<User>>();
        var user = new User
        {
            UserName = "testplayer@example.com",
            Email = "testplayer@example.com",
            EmailConfirmed = true
        };

        await userManager.CreateAsync(user, "Test123!");

        var player = new Player
        {
            UserId = user.Id,
            Name = "Player to Delete",
            Balance = 50.00m,
            IsActive = true
        };

        using (var scope = ApplicationServices.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            dbContext.Players.Add(player);
            await dbContext.SaveChangesAsync();
        }

        // Act: we make a request without an authorization token
        Client.DefaultRequestHeaders.Authorization = null; // It is important to remove the token
        var response = await Client.DeleteAsync($"/api/player/{player.Id}");

        // Assert: check that 401 Unauthorized is returned
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

}
