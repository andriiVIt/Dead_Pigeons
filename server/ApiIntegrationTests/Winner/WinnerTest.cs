using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using DataAccess;
using DataAccess.models;
using FluentAssertions;
using Generated;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

public class WinnerTest : ApiTestBase
{
    [Fact]
public async Task GetWinnersByGame_ShouldReturnWinners()
{
    // Arrange
    var gameId = Guid.NewGuid();
    var playerId = Guid.NewGuid();
    var winnerId = Guid.NewGuid();
    var userId = Guid.NewGuid().ToString(); // Unique UserId

    using (var scope = ApplicationServices.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        // Create user
        var user = new User
        {
            Id = userId,
            UserName = "testplayer@example.com",
            Email = "testplayer@example.com",
            EmailConfirmed = true
        };

        var createUserResult = await userManager.CreateAsync(user, "Test123!");
        if (!createUserResult.Succeeded)
        {
            throw new Exception("Failed to create test user.");
        }

        // Create the game
        var game = new Game
        {
            Id = gameId,
            StartDate = DateTime.UtcNow,
            WinningSequence = new List<int> { 1, 2, 3 }
        };

        // Create the player
        var player = new Player
        {
            Id = playerId,
            UserId = userId, // Communication with the created user
            Name = "Test Player",
            Balance = 100,
            IsActive = true
        };

        // Create the winner
        var winner = new Winner
        {
            Id = winnerId,
            GameId = game.Id,
            PlayerId = player.Id,
            WinningAmount = 500
        };

        // Adding to the database
        dbContext.Games.Add(game);
        dbContext.Players.Add(player);
        dbContext.Winners.Add(winner);
        await dbContext.SaveChangesAsync();
    }

    Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _jwtToken);

    // Act
    var response = await Client.GetAsync($"/api/winner/game/{gameId}");

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.OK);
    var winners = await response.Content.ReadFromJsonAsync<List<GetWinnerDto>>();
    winners.Should().NotBeNull();
    winners.Should().HaveCount(1);
    winners[0].GameId.Should().Be(gameId);
}

    [Fact]
public async Task GetWinnerById_ShouldReturnWinnerDetails()
{
    // Arrange
    var winnerId = Guid.NewGuid();
    var playerId = Guid.NewGuid();
    var gameId = Guid.NewGuid();
    var userId = Guid.NewGuid().ToString(); // Unique ID for the user

    using (var scope = ApplicationServices.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        // Create user
        var user = new User
        {
            Id = userId, // Set the ID that will match the UserId in the Player
            UserName = "testplayer@example.com",
            Email = "testplayer@example.com",
            EmailConfirmed = true
        };
        var createUserResult = await userManager.CreateAsync(user, "Test123!");
        if (!createUserResult.Succeeded)
        {
            throw new Exception("Failed to create test user.");
        }

         
        var game = new Game
        {
            Id = gameId,
            StartDate = DateTime.UtcNow,
            WinningSequence = new List<int> { 1, 2, 3 }
        };

         
        var player = new Player
        {
            Id = playerId,
            UserId = userId,  
            Name = "Test Player",
            Balance = 100,
            IsActive = true
        };

        // Create the winner
        var winner = new Winner
        {
            Id = winnerId,
            GameId = game.Id,
            PlayerId = player.Id,
            WinningAmount = 500
        };

        // Adding data to the database
        dbContext.Games.Add(game);
        dbContext.Players.Add(player);
        dbContext.Winners.Add(winner);
        await dbContext.SaveChangesAsync();
    }

    Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _jwtToken);

    // Act
    var response = await Client.GetAsync($"/api/winner/{winnerId}");

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.OK);
    var winnerDto = await response.Content.ReadFromJsonAsync<GetWinnerDto>();
    winnerDto.Should().NotBeNull();
    winnerDto.Id.Should().Be(winnerId);
}
    [Fact]
public async Task CheckForWinner_ShouldReturnWinnerResponse()
{
    // Arrange
    var gameId = Guid.NewGuid();
    var playerId = Guid.NewGuid();
    using (var scope = ApplicationServices.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        // First we create a user
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            UserName = "testplayer@example.com",
            Email = "testplayer@example.com",
            EmailConfirmed = true
        };
        await userManager.CreateAsync(user, "Test123!");

        // Create a player bound to the user
        var player = new Player
        {
            Id = playerId,
            UserId = user.Id,
            Name = "Test Player",
            Balance = 100,
            IsActive = true
        };

        // Create a board game
        var game = new Game
        {
            Id = gameId,
            StartDate = DateTime.UtcNow,
            WinningSequence = new List<int> { 1, 2, 3 },
            Boards = new List<Board>
            {
                new Board
                {
                    Id = Guid.NewGuid(),
                    PlayerId = playerId,
                    GameId = gameId,
                    Numbers = new List<int> { 1, 2, 3 },
                    Price = 100
                }
            }
        };

        dbContext.Players.Add(player);
        dbContext.Games.Add(game);
        await dbContext.SaveChangesAsync();
    }

    Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _jwtToken);

    // Act
    var response = await Client.PostAsJsonAsync($"/api/winner/game/{gameId}/check", playerId);

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.OK);
    var winnerResponse = await response.Content.ReadFromJsonAsync<CheckWinnerResponseDto>();
    winnerResponse.Should().NotBeNull();
    winnerResponse.IsWinner.Should().BeTrue();
    winnerResponse.PrizeAmount.Should().BeGreaterThan(0);
}
}
