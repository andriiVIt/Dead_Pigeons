 

using DataAccess;
using DataAccess.models;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Service;
using Service.DTO.Auth.Dto;
using Service.Security;
using Role = Service.Role;

namespace API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    [HttpPost]
    [Route("login")]
    [AllowAnonymous]
    public async Task<LoginResponse> Login(
        [FromServices] UserManager<User> userManager,
        [FromServices] IValidator<LoginRequest> validator,
        [FromServices] ITokenClaimsService tokenClaimsService,
        [FromBody] LoginRequest data
    )
    {
        await validator.ValidateAndThrowAsync(data);
        var user = await userManager.FindByEmailAsync(data.Email);
        if (user == null || !await userManager.CheckPasswordAsync(user, data.Password))
        {
            throw new AuthenticationError();
        }

        var token = await tokenClaimsService.GetTokenAsync(data.Email);

        return new LoginResponse(Jwt: token);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [Route("register")]
     
    public async Task<RegisterResponse> Register(
        IOptions<AppOptions> options,
        [FromServices] UserManager<User> userManager,
        [FromServices] IEmailSender<User> emailSender,
        [FromServices] IValidator<RegisterRequest> validator,
        [FromServices] AppDbContext dbContext, // Added database context
        [FromBody] RegisterRequest data
    )
    {
        // Validation of input data
        await validator.ValidateAndThrowAsync(data);

        // Create user
        var user = new User { UserName = data.Email, Email = data.Email };
        var result = await userManager.CreateAsync(user, data.Password);
        if (!result.Succeeded)
        {
            throw new ValidationError(
                result.Errors.ToDictionary(x => x.Code, x => new[] { x.Description })
            );
        }

        // Add a role for the user
        await userManager.AddToRoleAsync(user, Role.Player);

        // Generation of email confirmation token
        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);

        var qs = new Dictionary<string, string?> { { "token", token }, { "email", user.Email } };
        var confirmationLink = new UriBuilder(options.Value.Address)
        {
            Path = "/api/auth/confirm",
            Query = QueryString.Create(qs).Value
        }.Uri.ToString();

        // Sending a confirmation email
        await emailSender.SendConfirmationLinkAsync(user, user.Email, confirmationLink);

        // Adding an entry to the Players table
        var player = new Player
        {
            UserId = user.Id,
            Name = data.Name ?? user.UserName, // The name can be taken from data or email
            Balance = 0,// Player's starting balance
            IsActive = true // By default, the player is active
        };
        dbContext.Players.Add(player);
        await dbContext.SaveChangesAsync(); // Save changes to the database

        return new RegisterResponse(Email: user.Email, Name: user.UserName);
    }

    [HttpPost]
    [Route("logout")]
    [Authorize]
    public async Task<IResult> Logout([FromServices] SignInManager<User> signInManager)
    {
        await signInManager.SignOutAsync();
        return Results.Ok();
        
    }

    [HttpGet]
    [Route("userinfo")]
    public async Task<AuthUserInfo> UserInfo([FromServices] UserManager<User> userManager)
    {
        var username = (HttpContext.User.Identity?.Name) ?? throw new AuthenticationError();
        var user = await userManager.FindByNameAsync(username) ?? throw new AuthenticationError();
        var roles = await userManager.GetRolesAsync(user);

        // Checking roles
        var isAdmin = roles.Contains(Role.Admin);
        var isPlayer = roles.Contains(Role.Player);

        return new AuthUserInfo(username, isAdmin, isPlayer);
    }
    [HttpGet]
    [Route("confirm")]
    [AllowAnonymous]
    public async Task<IResult> ConfirmEmail(
        [FromServices] UserManager<User> userManager,
        string token,
        string email
    )
    {
        var user = await userManager.FindByEmailAsync(email) ?? throw new AuthenticationError();
        var result = await userManager.ConfirmEmailAsync(user, token);
        if (!result.Succeeded)
            throw new AuthenticationError();
        return Results.Content("<h1>Email confirmed</h1>", "text/html", statusCode: 200);
    }
}