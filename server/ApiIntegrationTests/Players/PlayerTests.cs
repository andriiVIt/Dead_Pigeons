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
                UserId = user.Id, // Використовуємо коректний UserId
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
        response.StatusCode.Should().Be(HttpStatusCode.OK); // Очікуємо 200
        var updatedPlayer = await response.Content.ReadFromJsonAsync<GetPlayerDto>();
        updatedPlayer.Name.Should().Be(updateDto.Name);
        updatedPlayer.Balance.Should().Be(updateDto.Balance);
        updatedPlayer.IsActive.Should().Be(updateDto.IsActive);
    }

    [Fact]
    public async Task DeletePlayer_ShouldReturnNoContent()
    {
        // Arrange: створюємо тестового користувача
        var userManager = ApplicationServices.GetRequiredService<UserManager<User>>();
        var user = new User
        {
            UserName = "testplayer@example.com",
            Email = "testplayer@example.com",
            EmailConfirmed = true
        };

        await userManager.CreateAsync(user, "Test123!");

        // Створення тестового гравця
        var player = new Player
        {
            UserId = user.Id, // Використовуємо ідентифікатор створеного користувача
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

        // Додаємо авторизаційний токен
        Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _jwtToken);

        // Act: видаляємо гравця
        var response = await Client.DeleteAsync($"/api/player/{player.Id}");

        // Assert: перевіряємо, що статус відповіді 204 NoContent
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
        // Arrange: створюємо тестового користувача і гравця
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

        // Act: робимо запит без токена авторизації
        Client.DefaultRequestHeaders.Authorization = null; // Важливо видалити токен
        var response = await Client.DeleteAsync($"/api/player/{player.Id}");

        // Assert: перевіряємо, що повертається 401 Unauthorized
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

}
