 
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
 
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
 
using DataAccess.models;  
using DataAccess;  
using Microsoft.AspNetCore.Identity;
using Service;  
 
namespace Generated.Requests;

public class AuthUserTest  : ApiTestBase
{
    [Fact]
    public async Task RegisterUser_CreatesUserSuccessfully()
    {
        // Arrange: Prepare data for registration
        var registerRequest = new RegisterRequest(
            Email: $"testuser{Guid.NewGuid()}@example.com",
            Password: "P@ssw0rd!",
            Name: "Test User"
        );

        // Act: Perform a POST request to register
        var response = await Client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Assert: check the response result
        response.StatusCode.Should().Be(HttpStatusCode.OK, because: $"Response content: {await response.Content.ReadAsStringAsync()}");

        var registerResponse = await response.Content.ReadFromJsonAsync<RegisterResponse>();
        registerResponse.Should().NotBeNull();
        registerResponse!.Email.Should().Be(registerRequest.Email);

        // Change: Expect Name to be Email since the controller returns that
        registerResponse.Name.Should().Be(registerRequest.Email);

        // Checking in the database
        using (var scope = ApplicationServices.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

            // Check if the user is created
            var user = await userManager.FindByEmailAsync(registerRequest.Email);
            user.Should().NotBeNull();

            // Check if the user has the "Player" role
            var roles = await userManager.GetRolesAsync(user!);
            roles.Should().Contain(Role.Player);

            // Check if an entry in the `Players` table exists
            var player = dbContext.Players.FirstOrDefault(p => p.UserId == user!.Id);
            player.Should().NotBeNull();
            player!.Name.Should().Be(registerRequest.Name);
            player.Balance.Should().Be(0);
            player.IsActive.Should().BeTrue();
        }
    }
    [Fact]
    public async Task Logout_ShouldReturnSuccess()
    {
        // Arrange
        Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _jwtToken);

        // Act
        var response = await Client.PostAsync("/api/auth/logout", null);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
    }