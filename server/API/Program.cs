using Api.Misc;
using DataAccess;
using DataAccess.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Service;
using Service.Interfaces;
using Service.Repositories;
using Service.Security;
using FluentValidation.AspNetCore;
using Service.DTO.Board;
 
using Service.DTO.Game;
using Service.DTO.Player;
using Service.DTO.Transaction;
 
using Service.Services;
 
using Service.Validators;
using Service.Validators.Board;

namespace Api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        #region Configuration
        builder
            .Services.AddOptionsWithValidateOnStart<AppOptions>()
            .Bind(builder.Configuration.GetSection(nameof(AppOptions)))
            .ValidateDataAnnotations();
        builder.Services.AddSingleton(_ => TimeProvider.System);
        #endregion

        #region Data Access
        var connectionString = builder.Configuration.GetConnectionString("AppDb");
        builder.Services.AddDbContext<AppDbContext>(options =>
            options
                .UseNpgsql(connectionString)
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
        );
        builder.Services.AddScoped<DbSeeder>();
        builder.Services.AddScoped<IRepository<User>, UserRepository>();
        // builder.Services.AddScoped<IRepository<Post>, PostRepository>();
        // builder.Services.AddScoped<IRepository<Comment>, CommentRepository>();
        #endregion

          
        builder
            .Services.AddIdentityApiEndpoints<User>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<AppDbContext>();
        builder.Services.AddSingleton<IPasswordHasher<User>, Argon2idPasswordHasher<User>>();
        var options = builder.Configuration.GetSection(nameof(AppOptions)).Get<AppOptions>()!;
        builder
            .Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(o =>
            {
                o.TokenValidationParameters = JwtTokenClaimService.ValidationParameters(options);
            });
        builder.Services.AddScoped<ITokenClaimsService, JwtTokenClaimService>();
        builder.Services.AddAuthorization(options =>
        {
            options.FallbackPolicy = new AuthorizationPolicyBuilder()
                // Globally require users to be authenticated
                .RequireAuthenticatedUser()
                .Build();
        });
        
        #region FluentValidation
         
        builder.Services.AddFluentValidationAutoValidation()
            .AddFluentValidationClientsideAdapters();
        builder.Services.AddValidatorsFromAssemblyContaining<ServiceAssembly>();
        
        builder.Services.AddScoped<IValidator<CreatePlayerDto>, CreatePlayerDtoValidator>();
        builder.Services.AddScoped<IValidator<UpdatePlayerDto>, UpdatePlayerDtoValidator>();
        builder.Services.AddScoped<IValidator<CreateGameDto>, CreateGameDtoValidator>();
        builder.Services.AddScoped<IValidator<UpdateGameDto>, UpdateGameDtoValidator>();
        builder.Services.AddScoped<IValidator<CreateBoardDto>, CreateBoardDtoValidator>();
        builder.Services.AddScoped<IValidator<CreateTransactionDto>, CreateTransactionDtoValidator>();
        builder.Services.AddScoped<IValidator<UpdateTransactionDto>, UpdateTransactionDtoValidator>();
        #endregion

        #region Services
        builder.Services.AddValidatorsFromAssemblyContaining<ServiceAssembly>();
        builder.Services.AddScoped<IPlayerService, PlayerService>();
        builder.Services.AddScoped<IGameService, GameService>();
        builder.Services.AddScoped<ITransactionService, TransactionService>();
         builder.Services.AddScoped<IBoardService, BoardService>();
         builder.Services.AddScoped<IWinnerService, WinnerService>();
        #endregion

        #region Swagger
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(c =>
        {
            c.AddSecurityDefinition(
                "Bearer",
                new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please insert JWT with Bearer into field",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                }
            );
            c.AddSecurityRequirement(
                new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                {
                    {
                        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header
                        },
                        new string[] { }
                    }
                }
            );
        });
        #endregion

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        app.UseMiddleware<ErrorHandlingMiddleware>();

        // Seed
        using (var scope = app.Services.CreateScope())
        {
            scope.ServiceProvider.GetRequiredService<DbSeeder>().SeedAsync().Wait();
        }

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger(c =>
            {
                c.RouteTemplate = "api/swagger/{documentname}/swagger.json";
            });

            app.UseSwaggerUI(c =>
            {
                c.RoutePrefix = "api/swagger";
            });
        }
        // app.MapGet("/", context =>
        // {
        //     context.Response.Redirect("/api/swagger/index.html");
        //     return Task.CompletedTask;
        // });
        app.UseHttpsRedirection();
        // app.MapIdentityApi<User>();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }
}
