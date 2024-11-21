 

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
    [Route("register")]
    [AllowAnonymous]
    public async Task<RegisterResponse> Register(
        IOptions<AppOptions> options,
        [FromServices] UserManager<User> userManager,
        [FromServices] IEmailSender<User> emailSender,
        [FromServices] IValidator<RegisterRequest> validator,
        [FromBody] RegisterRequest data
    )
    {
        await validator.ValidateAndThrowAsync(data);

        var user = new User { UserName = data.Email, Email = data.Email };
        var result = await userManager.CreateAsync(user, data.Password);
        if (!result.Succeeded)
        {
            throw new ValidationError(
                result.Errors.ToDictionary(x => x.Code, x => new[] { x.Description })
            );
        }
        await userManager.AddToRoleAsync(user, Role.Player);
        
        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);

        var qs = new Dictionary<string, string?> { { "token", token }, { "email", user.Email } };
        var confirmationLink = new UriBuilder(options.Value.Address)
        {
            Path = "/api/auth/confirm",
            Query = QueryString.Create(qs).Value
        }.Uri.ToString();

        await emailSender.SendConfirmationLinkAsync(user, user.Email, confirmationLink);

        return new RegisterResponse(Email: user.Email, Name: user.UserName);
    }

    [HttpPost]
    [Route("logout")]
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
    
    
    [HttpPost]
    [Route("password-reset/initiate")]
    [AllowAnonymous]
    public async Task<IResult> InitiatePasswordReset(
        [FromServices] UserManager<User> userManager,
        [FromServices] IValidator<InitPasswordResetRequest> validator,
        [FromServices] IEmailSender<User> emailSender,
        [FromBody] InitPasswordResetRequest data)
    {
        await validator.ValidateAndThrowAsync(data);

        var user = await userManager.FindByEmailAsync(data.Email);
        if (user == null)
        {
            return Results.NotFound(new { Message = "User not found" });
        }

        var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
        var resetLink = Url.Action(
            "ResetPassword",
            "Auth",
            new { token = resetToken, email = user.Email },
            Request.Scheme
        );

        await emailSender.SendPasswordResetLinkAsync(user, user.Email, resetLink);

        return Results.Ok(new { Message = "Password reset email sent" });
    } 
    [HttpPost]
    [Route("password-reset")]
    [AllowAnonymous]
    public async Task<IResult> ResetPassword(
        [FromServices] UserManager<User> userManager,
        [FromServices] IValidator<PasswordResetRequest> validator,
        [FromBody] PasswordResetRequest data)
    {
        await validator.ValidateAndThrowAsync(data);

        var user = await userManager.FindByEmailAsync(data.Email);
        if (user == null)
        {
            return Results.NotFound(new { Message = "User not found" });
        }

        var result = await userManager.ResetPasswordAsync(user, data.Token, data.NewPassword);
        if (!result.Succeeded)
        {
            return Results.BadRequest(new { Errors = result.Errors.Select(e => e.Description) });
        }

        return Results.Ok(new { Message = "Password has been reset successfully" });
    }

}