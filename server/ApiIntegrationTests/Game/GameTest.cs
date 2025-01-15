using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using DataAccess;
using DataAccess.models;
using FluentAssertions;
using Generated;
using Microsoft.Extensions.DependencyInjection; 
using Xunit;

public class GameTests : ApiTestBase
{
     

    [Fact]
    public async Task GetAllGames_ReturnsOk_AndContainsSeededGame()
    {
        // Send a request to /api/game
        var response = await Client.GetAsync("/api/game");

        // Check that the response code is 200 OK
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        // We get the content in the form of a string
        var content = await response.Content.ReadAsStringAsync();

        // Since in Seed() we added a game with WinningSequence = {1,2,3}, 
        // check that these numbers are in the JSON response.
        content.Should().Contain("1").And.Contain("2").And.Contain("3");
    }

    [Fact]
    public async Task GetGameById_ReturnsOkAndGame()
    {
        // Select the id of the game from the Seed (from the base)
        using var scope = ApplicationServices.CreateScope();
        var ctx = scope.ServiceProvider.GetRequiredService<DataAccess.AppDbContext>();
        var game = ctx.Games.First();

        // Send request to /api/game/{id}
        var response = await Client.GetAsync($"/api/game/{game.Id}");
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        // Check that the content contains the Id of the game and some part of the data
        content.Should().Contain(game.Id.ToString());
        
    }
    [Fact]
    public async Task DeleteGame_RemovesGameFromDatabase()
    {
        using (var scope = ApplicationServices.CreateScope())
        {
            var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            // Create a game for the test
            var game = new Game
            {
                Id = Guid.NewGuid(),
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddMinutes(10),
                WinningSequence = new List<int> { 1, 2, 3 }
            };
            ctx.Games.Add(game);
            ctx.SaveChanges();

            // We check that the game is in the base
            var existingGame = ctx.Games.Find(game.Id);
            existingGame.Should().NotBeNull();

            // We send a DELETE request
            var response = await Client.DeleteAsync($"/api/game/{game.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Check that the game has been removed
            using var freshCtx = ApplicationServices.CreateScope().ServiceProvider.GetRequiredService<AppDbContext>();
            var deletedGame = freshCtx.Games.Find(game.Id);
            deletedGame.Should().BeNull();
        }
    }
    // [Fact]
    // public async Task UpdateGame_UpdatesGameSuccessfully()
    // {
    //     
    //     var createDto = new CreateGameDto
    //     {
    //         StartDate = DateTime.UtcNow,
    //         EndDate = DateTime.UtcNow.AddMinutes(10),
    //         WinningSequence = new List<int> { 1, 2, 3 }
    //     };
    //
    //     var createResponse = await Client.PostAsJsonAsync("/api/game", createDto);
    //     createResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    //
    //     var createdGame = await createResponse.Content.ReadFromJsonAsync<GetGameDto>();
    //     createdGame.Should().NotBeNull();
    //     createdGame!.WinningSequence.Should().ContainInOrder(1, 2, 3);
    //
    //      
    //     var updateDto = new UpdateGameDto
    //     {
    //         StartDate = createdGame.StartDate.AddMinutes(-5),
    //         EndDate = createdGame.EndDate?.AddMinutes(5),
    //         WinningSequence = new List<int> { 4, 5, 6 }
    //     };
    //
    //     var updateResponse = await Client.PutAsJsonAsync($"/api/game/{createdGame.Id}", updateDto);
    //     updateResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    //
    //      
    //     var updatedGame = await updateResponse.Content.ReadFromJsonAsync<GetGameDto>();
    //     updatedGame.Should().NotBeNull();
    //     updatedGame!.Id.Should().Be(createdGame.Id);
    //     updatedGame.WinningSequence.Should().ContainInOrder(4, 5, 6);
    //     updatedGame.StartDate.Should().Be(updateDto.StartDate);
    //     updatedGame.EndDate.Should().Be(updateDto.EndDate);
    //
    //      
    //     using (var scope = ApplicationServices.CreateScope())
    //     {
    //         var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    //         var gameInDb = ctx.Games.Find(createdGame.Id);
    //
    //         gameInDb.Should().NotBeNull();
    //         gameInDb!.WinningSequence.Should().ContainInOrder(4, 5, 6);
    //         gameInDb.StartDate.Should().BeCloseTo(updateDto.StartDate.UtcDateTime, TimeSpan.FromSeconds(1));
    //         if (updateDto.EndDate.HasValue)
    //         {
    //             gameInDb.EndDate.Should().BeCloseTo(updateDto.EndDate.Value.UtcDateTime, TimeSpan.FromSeconds(1));
    //         }
    //         else
    //         {
    //             gameInDb.EndDate.Should().BeNull();
    //         }
    //     }
    // }
   
        
        
        // [Fact]
    // public async Task CreateGame_ReturnsOkAndCreatesGame()
    // {
    //      
    //     var dto = new CreateGameDto
    //     {
    //         StartDate = DateTime.UtcNow,
    //         EndDate = DateTime.UtcNow.AddMinutes(10),
    //         WinningSequence = new List<int> { 1, 2, 3 }
    //     };
    //
    //     var response = await Client.PostAsJsonAsync("/api/game", dto);
    //
    //     response.IsSuccessStatusCode.Should().BeTrue($"Response was not OK. StatusCode: {response.StatusCode}");
    //
    //     var createdGame = await response.Content.ReadFromJsonAsync<GetGameDto>();
    //     createdGame.Should().NotBeNull();
    //     createdGame!.WinningSequence.Should().ContainInOrder(1, 2, 3);
    // }
}
    