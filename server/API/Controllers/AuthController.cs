 

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
        [FromServices] AppDbContext dbContext, // Додано контекст бази даних
        [FromBody] RegisterRequest data
    )
    {
        // Валідація вхідних даних
        await validator.ValidateAndThrowAsync(data);

        // Створення користувача
        var user = new User { UserName = data.Email, Email = data.Email };
        var result = await userManager.CreateAsync(user, data.Password);
        if (!result.Succeeded)
        {
            throw new ValidationError(
                result.Errors.ToDictionary(x => x.Code, x => new[] { x.Description })
            );
        }

        // Додавання ролі для користувача
        await userManager.AddToRoleAsync(user, Role.Player);

        // Генерація токена підтвердження email
        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);

        var qs = new Dictionary<string, string?> { { "token", token }, { "email", user.Email } };
        var confirmationLink = new UriBuilder(options.Value.Address)
        {
            Path = "/api/auth/confirm",
            Query = QueryString.Create(qs).Value
        }.Uri.ToString();

        // Надсилання листа з підтвердженням
        await emailSender.SendConfirmationLinkAsync(user, user.Email, confirmationLink);

        // Додавання запису в таблицю Players
        var player = new Player
        {
            UserId = user.Id,
            Name = data.Name ?? user.UserName, // Ім'я можна взяти з даних або email
            Balance = 0, // Початковий баланс гравця
            IsActive = true // За замовчуванням гравець активний
        };
        dbContext.Players.Add(player);
        await dbContext.SaveChangesAsync(); // Збереження змін у базі даних

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

        // Перевірка ролей
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