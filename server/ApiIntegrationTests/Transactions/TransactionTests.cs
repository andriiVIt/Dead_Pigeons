 using System.Net;
using System.Net.Http.Json;
using Xunit;
using FluentAssertions;
using DataAccess;
using DataAccess.models;
using Microsoft.Extensions.DependencyInjection;
using Service.DTO.Transaction;
using System;

public class TransactionControllerTests : ApiTestBase
{
    
    [Fact]
    public async Task CreateTransaction_ReturnsOkAndTransaction()
    {
        // Створимо тестового гравця, щоб ми могли зробити транзакцію
        using (var scope = ApplicationServices.CreateScope())
        {
            var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();

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
                UserId = user.Id, // встановлюємо user.Id
                Name = "Test Player",
                Balance = 100m,
                IsActive = true
            };
            ctx.Players.Add(player);
            ctx.SaveChanges();

            // Створюємо DTO для транзакції
            var dto = new CreateTransactionDto
            {
                PlayerId = player.Id,
                Amount = 50m,
                MobilePayTransactionId = "ggggggggg"
            };

            // Відправляємо POST запит до /api/transaction
            var response = await Client.PostAsJsonAsync("/api/transaction", dto);

            // Перевірка статусу
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Перевіряємо вміст відповіді
            var result = await response.Content.ReadFromJsonAsync<GetTransactionDto>();
            result.Should().NotBeNull();
            result!.PlayerId.Should().Be(player.Id);
            result.Amount.Should().Be(50m);
            result.MobilePayTransactionId.Should().Be("ggggggggg");

            // Перевіримо, що транзакція справді збереглася в БД
            var savedTransaction = ctx.Transactions.Find(result.Id);
            savedTransaction.Should().NotBeNull();
            savedTransaction!.Amount.Should().Be(50m);
            savedTransaction.PlayerId.Should().Be(player.Id);
        }
    }
    [Fact]
public async Task DeleteTransaction_RemovesTransactionFromDatabase()
{
    using (var scope = ApplicationServices.CreateScope())
    {
        var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Створюємо користувача
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            UserName = "testdelete@example.com",
            Email = "testdelete@example.com"
        };
        ctx.Users.Add(user);
        ctx.SaveChanges();

        // Створюємо гравця
        var player = new Player
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Name = "Delete Test Player",
            Balance = 200m,
            IsActive = true
        };
        ctx.Players.Add(player);
        ctx.SaveChanges();

        // Створюємо транзакцію
        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            PlayerId = player.Id,
            Amount = 100m,
            MobilePayTransactionId = "delete_test",
            TransactionDate = DateTime.UtcNow
        };
        ctx.Transactions.Add(transaction);
        ctx.SaveChanges();

        // Перевіряємо, що транзакція збережена
        var existingTransaction = ctx.Transactions.Find(transaction.Id);
        existingTransaction.Should().NotBeNull();

        // Відправляємо DELETE запит
        var response = await Client.DeleteAsync($"/api/transaction/{transaction.Id}");
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Перевіряємо стан бази даних з новим контекстом
        using (var freshCtx = ApplicationServices.CreateScope().ServiceProvider.GetRequiredService<AppDbContext>())
        {
            // Транзакція має бути видалена
            var deletedTransaction = freshCtx.Transactions.Find(transaction.Id);
            deletedTransaction.Should().BeNull();

            // Баланс гравця має бути оновлений
            var updatedPlayer = freshCtx.Players.Find(player.Id);
            updatedPlayer.Should().NotBeNull();
            updatedPlayer!.Balance.Should().Be(100m); // 200 - 100
        }
    }
}
}
