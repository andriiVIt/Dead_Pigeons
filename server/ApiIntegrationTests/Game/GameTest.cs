using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using DataAccess;
using DataAccess.models;
using FluentAssertions;
using Generated;
using Microsoft.Extensions.DependencyInjection; // Якщо ви встановили FluentAssertions
using Xunit;

public class GameTests : ApiTestBase
{
     

    [Fact]
    public async Task GetAllGames_ReturnsOk_AndContainsSeededGame()
    {
        // Надсилаємо запит до /api/game
        var response = await Client.GetAsync("/api/game");

        // Перевіряємо, що код відповіді - 200 OK
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        // Отримуємо контент у вигляді рядка
        var content = await response.Content.ReadAsStringAsync();

        // Оскільки у Seed() ми додали гру з WinningSequence = {1,2,3}, 
        // перевіримо, що ці числа є в JSON-відповіді.
        content.Should().Contain("1").And.Contain("2").And.Contain("3");
    }

    [Fact]
    public async Task GetGameById_ReturnsOkAndGame()
    {
        // Вибираємо Id гри з Seed (з бази)
        using var scope = ApplicationServices.CreateScope();
        var ctx = scope.ServiceProvider.GetRequiredService<DataAccess.AppDbContext>();
        var game = ctx.Games.First();

        // Надсилаємо запит до /api/game/{id}
        var response = await Client.GetAsync($"/api/game/{game.Id}");
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        // Перевіримо, що контент містить Id гри та якусь частину даних
        content.Should().Contain(game.Id.ToString());
        
    }
    [Fact]
    public async Task DeleteGame_RemovesGameFromDatabase()
    {
        using (var scope = ApplicationServices.CreateScope())
        {
            var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            // Створюємо гру для тесту
            var game = new Game
            {
                Id = Guid.NewGuid(),
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddMinutes(10),
                WinningSequence = new List<int> { 1, 2, 3 }
            };
            ctx.Games.Add(game);
            ctx.SaveChanges();

            // Перевіряємо, що гра є в базі
            var existingGame = ctx.Games.Find(game.Id);
            existingGame.Should().NotBeNull();

            // Відправляємо DELETE-запит
            var response = await Client.DeleteAsync($"/api/game/{game.Id}");
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);

            // Перевіряємо, що гра видалена
            using var freshCtx = ApplicationServices.CreateScope().ServiceProvider.GetRequiredService<AppDbContext>();
            var deletedGame = freshCtx.Games.Find(game.Id);
            deletedGame.Should().BeNull();
        }
    }
    // [Fact]
    // public async Task CreateGame_ReturnsOkAndCreatesGame()
    // {
    //     // Тепер токен встановлено
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
