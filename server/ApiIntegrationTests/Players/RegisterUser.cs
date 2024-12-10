using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Xunit;
using DataAccess.models; // для User, Player
using DataAccess; // для AppDbContext
using Microsoft.AspNetCore.Identity;
using Service; // для UserManager, IdentityRole
 
using Service.DTO.Auth.Dto;
namespace Generated.Players;

public class RegisterUser  : ApiTestBase
{
    [Fact]
    public async Task RegisterUser_ReturnsOkAndCreatesUser()
    {
        // // Arrange: підготуйте дані для реєстрації
        // var registerRequest = new RegisterRequest(
        //     Email: "testuser@example.com",
        //     Password: "P@ssw0rd!",
        //     Name: "Test User"
        // );
        //
        // // Act: виконайте POST-запит для реєстрації
        // var response = await Client.PostAsJsonAsync("/api/auth/register", registerRequest);
        //
        // // Assert: перевірте результат
        // response.StatusCode.Should().Be(HttpStatusCode.OK);
        //
        // var registerResponse = await response.Content.ReadFromJsonAsync<RegisterResponse>();
        // registerResponse.Should().NotBeNull();
        // registerResponse!.Email.Should().Be(registerRequest.Email);
        // registerResponse.Name.Should().Be(registerRequest.Name);
        //
        // // Перевірка в базі даних
        // using (var scope = ApplicationServices.CreateScope())
        // {
        //     var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        //     var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        //
        //     // Перевірте, чи користувач створений
        //     var user = await userManager.FindByEmailAsync(registerRequest.Email);
        //     user.Should().NotBeNull();
        //
        //     // Перевірте, чи користувач має роль "Player"
        //     var roles = await userManager.GetRolesAsync(user!);
        //     roles.Should().Contain(Role.Player);
        //
        //     // Перевірте, чи запис у таблиці `Players` існує
        //     var player = dbContext.Players.FirstOrDefault(p => p.UserId == user!.Id);
        //     player.Should().NotBeNull();
        //     player!.Name.Should().Be(registerRequest.Name);
        //     player.Balance.Should().Be(0);
        //     player.IsActive.Should().BeTrue();
        // }

        
            
    }
    }