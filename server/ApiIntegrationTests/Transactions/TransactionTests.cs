 using System.Net;
using System.Net.Http.Json;
using Xunit;
using FluentAssertions;
using DataAccess;
using DataAccess.models;
using Microsoft.Extensions.DependencyInjection;
using System;
using Generated;
using CreateTransactionDto = Service.DTO.Transaction.CreateTransactionDto;

public class TransactionControllerTests : ApiTestBase
{
    
    [Fact]
    
    public async Task CreateTransaction_ReturnsOkAndTransaction()
    { 
        //Arrange
        // Create a test scope for Dependency Injection (DI)
        using (var scope = ApplicationServices.CreateScope())
        { // Get the AppDbContext from the service provider
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
                UserId = user.Id, // set user id
                Name = "Test Player",
                Balance = 100m,
                IsActive = true
            };
            ctx.Players.Add(player);
            ctx.SaveChanges();

            // Create a DTO for the transaction
            var dto = new CreateTransactionDto
            {
                PlayerId = player.Id,
                Amount = 50m,
                MobilePayTransactionId = "ggggggggg"
            };
             //act
            // Send a POST request to /api/transaction
            var response = await Client.PostAsJsonAsync("/api/transaction", dto);

            // Status check
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            //Assert
            // We check the content of the response
            var result = await response.Content.ReadFromJsonAsync<GetTransactionDto>();
            result.Should().NotBeNull();
            result!.PlayerId.Should().Be(player.Id);
            result.Amount.Should().Be(50m);
            result.MobilePayTransactionId.Should().Be("ggggggggg");

            // Check that the transaction is really saved in the database
            var savedTransaction = ctx.Transactions.Find(result.Id);
            savedTransaction.Should().NotBeNull();
            savedTransaction!.Amount.Should().Be(50m);
            savedTransaction.PlayerId.Should().Be(player.Id);
        }
    }
    [Fact]
public async Task DeleteTransaction_RemovesTransactionFromDatabase_UsingSwaggerClient()
{
    using (var scope = ApplicationServices.CreateScope())
    {
        var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Create a test user
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            UserName = "testdelete@example.com",
            Email = "testdelete@example.com"
        };
        ctx.Users.Add(user);
        ctx.SaveChanges();

        // Create a test player
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

        // Create a test transaction
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

        // Verify transaction exists in the database
        var existingTransaction = ctx.Transactions.Find(transaction.Id);
        existingTransaction.Should().NotBeNull();

        // Use the Swagger client to delete the transaction
        var swaggerClient = scope.ServiceProvider.GetRequiredService<SwaggerClient>();
        await swaggerClient.TransactionDELETEAsync(transaction.Id);

        // Verify the transaction has been deleted from the database
        using (var freshCtx = ApplicationServices.CreateScope().ServiceProvider.GetRequiredService<AppDbContext>())
        {
            // The transaction should no longer exist
            var deletedTransaction = freshCtx.Transactions.Find(transaction.Id);
            deletedTransaction.Should().BeNull();

            // Verify the player's balance is updated
            var updatedPlayer = freshCtx.Players.Find(player.Id);
            updatedPlayer.Should().NotBeNull();
            updatedPlayer!.Balance.Should().Be(100m); // 200 - 100
        }
    }
}
[Fact]
public async Task UpdateTransaction_ReturnsOkAndUpdatedTransaction()
{
    Guid transactionId;

    // Arrange: create initial data
    using (var scope = ApplicationServices.CreateScope())
    {
        var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Create a user
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            UserName = "testupdate@example.com",
            Email = "testupdate@example.com"
        };
        ctx.Users.Add(user);
        ctx.SaveChanges();

        // Create a player
        var player = new Player
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Name = "Update Test Player",
            Balance = 300m,
            IsActive = true
        };
        ctx.Players.Add(player);
        ctx.SaveChanges();

        // Create a transaction
        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            PlayerId = player.Id,
            Amount = 100m,
            MobilePayTransactionId = "initial_transaction",
            TransactionDate = DateTime.UtcNow
        };
        ctx.Transactions.Add(transaction);
        ctx.SaveChanges();

        transactionId = transaction.Id; // Store the transaction ID
    }

    // DTO to update the transaction
    var updateDto = new
    {
        Amount = 200m,
        MobilePayTransactionId = "updated_transaction"
    };

    // Act: send a PUT request to update the transaction
    var response = await Client.PutAsJsonAsync($"/api/Transaction/{transactionId}", updateDto);

    // Assert: check the response status
    response.StatusCode.Should().Be(HttpStatusCode.OK);

    // Check that the transaction has been updated
    var updatedTransaction = await response.Content.ReadFromJsonAsync<GetTransactionDto>();
    updatedTransaction.Should().NotBeNull();
    updatedTransaction!.Id.Should().Be(transactionId);
    updatedTransaction.Amount.Should().Be(200m);
    updatedTransaction.MobilePayTransactionId.Should().Be("updated_transaction");

    // Checking in the database
    using (var freshScope = ApplicationServices.CreateScope())
    {
        var freshCtx = freshScope.ServiceProvider.GetRequiredService<AppDbContext>();
        var transactionInDb = freshCtx.Transactions.Find(transactionId);

        transactionInDb.Should().NotBeNull();
        transactionInDb!.Amount.Should().Be(200m); // Check the updated amount
        transactionInDb.MobilePayTransactionId.Should().Be("updated_transaction"); // Check the updated ID
    }
}
}
