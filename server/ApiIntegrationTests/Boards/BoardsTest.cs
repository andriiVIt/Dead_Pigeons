using System.Net;
using System.Net.Http.Json;
using Xunit;
using FluentAssertions;
using DataAccess;
using DataAccess.models;
using Microsoft.Extensions.DependencyInjection;
using Service.DTO.Board;

public class BoardsTests : ApiTestBase
{
    [Fact]
public async Task CreateBoard_ReturnsOkAndBoard()
{
    Guid playerId; // Declare a variable out of scope

    // Arrange
    using (var scope = ApplicationServices.CreateScope())
    {
        var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Create test user and player
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            UserName = "test@example.com",
            Email = "test@example.com"
        };
        ctx.Users.Add(user);
        ctx.SaveChanges();

        var player = new Player
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Name = "Test Player",
            Balance = 100m, // Sufficient balance to buy a board
            IsActive = true
        };
        ctx.Players.Add(player);

        // Save the player id for later use
        playerId = player.Id;

        // Create the game
        var game = new Game
        {
            Id = Guid.NewGuid(),
            StartDate = DateTime.UtcNow,
            EndDate = DateTime.UtcNow.AddHours(1),
            WinningSequence = new List<int> { 1, 2, 3 }
        };
        ctx.Games.Add(game);
        ctx.SaveChanges();

        // DTO to create the board
        var dto = new CreateBoardDto
        {
            PlayerId = player.Id,
            GameId = game.Id,
            Numbers = new List<int> { 1, 2, 3, 4, 5 } // Price for 5 numbers - 20m
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/board", dto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<GetBoardDto>();
        result.Should().NotBeNull();
        result!.PlayerId.Should().Be(player.Id);
        result.GameId.Should().Be(game.Id);
        result.Numbers.Should().BeEquivalentTo(dto.Numbers);
        result.Price.Should().Be(20m);

        // Checking that the board is saved in the database
        var savedBoard = ctx.Boards.Find(result.Id);
        savedBoard.Should().NotBeNull();
        savedBoard!.PlayerId.Should().Be(player.Id);
        savedBoard.GameId.Should().Be(game.Id);
        savedBoard.Numbers.Should().BeEquivalentTo(dto.Numbers);
        savedBoard.Price.Should().Be(20m);
    }

    // Check to update the player's balance in the new context
    using (var newScope = ApplicationServices.CreateScope())
    {
        var freshCtx = newScope.ServiceProvider.GetRequiredService<AppDbContext>();
        var updatedPlayer = freshCtx.Players.Find(playerId); // We use the stored ID

        updatedPlayer.Should().NotBeNull();
        updatedPlayer!.Balance.Should().Be(80m); // 100m - 20m
    }
}



     
}
