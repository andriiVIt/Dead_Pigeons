using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
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
    // [Fact]
    // public async Task CreateGame_ReturnsOkAndCreatesGame()
    // {
    //     // Формуємо дані для створення нової гри
    //     var dto = new CreateGameDto
    //     {
    //         StartDate = DateTime.UtcNow,
    //         EndDate = DateTime.UtcNow.AddMinutes(10),
    //         WinningSequence = new List<int> { 1, 2, 3 }
    //     };
    //
    //     // Надсилаємо POST запит до /api/game
    //     var response = await Client.PostAsJsonAsync("/api/game", dto);
    //     // Додаємо вивід відповіді у консоль
    //     var content = await response.Content.ReadAsStringAsync();
    //     Assert.True(response.IsSuccessStatusCode, $"Response was not OK. StatusCode: {response.StatusCode}, Content: {content}");
    //     Console.WriteLine("Response content: " + content);
    //
    //     // Тепер перевіряємо статус-код
    //     response.StatusCode.Should().Be(HttpStatusCode.OK);
    //     
    //     
    //     
    //
    //     // Перевіримо вміст відповіді
    //     var createdGame = await response.Content.ReadFromJsonAsync<GetGameDto>();
    //     createdGame.Should().NotBeNull();
    //     createdGame!.WinningSequence.Should().ContainInOrder(10, 20, 30);
    //
    //     // Перевіримо, чи гра дійсно створилась у БД
    //     using var scope = ApplicationServices.CreateScope();
    //     var ctx = scope.ServiceProvider.GetRequiredService<DataAccess.AppDbContext>();
    //     var dbGame = ctx.Games.FirstOrDefault(g => g.Id == createdGame.Id);
    //     dbGame.Should().NotBeNull();
    //     dbGame!.WinningSequence.Should().ContainInOrder(10, 20, 30);
    // }
}
