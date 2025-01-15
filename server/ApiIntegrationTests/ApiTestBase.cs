 using System.Net.Http.Headers;
 using Api;
 using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PgCtx; // ваш пакет
using DataAccess;
using DataAccess.models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Service;

public class ApiTestBase : WebApplicationFactory<Program>
{
    public PgCtxSetup<AppDbContext> PgCtxSetup { get; }
    public HttpClient Client { get; set; }
    public IServiceProvider ApplicationServices { get; set; }//Access to services with Dependency Injection (DI).
                                                              
     
    private protected readonly string _jwtToken = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJleHAiOjE3MzQyOTgyODQsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJhZG1pbkBleGFtcGxlLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiZWYxZmY2ZTMtNzU0OC00NjMwLWE0NGItNjFhM2NlYTZlZWY2IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJjdXJyZW50RGF0ZSI6IjIwMjQtMTItMDgiLCJpYXQiOjE3MzM2OTM0ODQsIm5iZiI6MTczMzY5MzQ4NH0.g4S0eGTWsDYbNHwgcczUbTKBNpTJMbuV8x61jHTVX1bttVsHsfCRwb_PWIGgqgCaeThgvw207RNS0b65GPKt1A";
    public ApiTestBase()
    {
        PgCtxSetup = new PgCtxSetup<AppDbContext>();
        ApplicationServices = Services.CreateScope().ServiceProvider;// Access to DI services.
        Client = CreateClient();
        using (var scope = ApplicationServices.CreateScope())
        {
            var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();// Gets the database context.
            ctx.Database.Migrate();// Applies all migrations (creates tables).
        }

        Seed().Wait();// Runs the `Seed` method to initially populate the database.
        // You can add authorization if needed
         Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJleHAiOjE3MzQyOTgyODQsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJhZG1pbkBleGFtcGxlLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiZWYxZmY2ZTMtNzU0OC00NjMwLWE0NGItNjFhM2NlYTZlZWY2IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJjdXJyZW50RGF0ZSI6IjIwMjQtMTItMDgiLCJpYXQiOjE3MzM2OTM0ODQsIm5iZiI6MTczMzY5MzQ4NH0.g4S0eGTWsDYbNHwgcczUbTKBNpTJMbuV8x61jHTVX1bttVsHsfCRwb_PWIGgqgCaeThgvw207RNS0b65GPKt1A");

        Seed().Wait();
    }

    
    public async Task Seed()
    {
        using var scope = ApplicationServices.CreateScope();// Access to DI services.
        var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();// Gets the database context.
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        ctx.Database.Migrate();
        // Creates roles
        if (!await roleManager.RoleExistsAsync(Role.Admin))
        {
            await roleManager.CreateAsync(new IdentityRole(Role.Admin));
        }

        if (!await roleManager.RoleExistsAsync(Role.Player))
        {
            await roleManager.CreateAsync(new IdentityRole(Role.Player));
        }
        // Add a test admin
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var adminUser = new User { UserName = "admin@test.com", Email = "admin@test.com" };

        if (await userManager.FindByEmailAsync(adminUser.Email) == null)
        {
            var result = await userManager.CreateAsync(adminUser, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, Role.Admin);
            }
        }
        // Let's create a test game
        var game = new Game
        {
            Id = Guid.NewGuid(),
            StartDate = DateTime.UtcNow,
            WinningSequence = new List<int> {1,2,3} 
        };
        ctx.Games.Add(game);
        await ctx.SaveChangesAsync();
    }

    protected override IHost CreateHost(IHostBuilder builder)
    {builder.ConfigureLogging(logging =>
        {
            logging.ClearProviders();// Deletes all standard loggers.
            logging.AddConsole();// Adds the logger to the console.
            logging.SetMinimumLevel(LogLevel.Debug);// The minimum log level is Debug.
        });
        builder.ConfigureServices(services =>
        {
            // Delete the original DbContext
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
            if (descriptor != null) services.Remove(descriptor);// Deletes the original DbContext.

            // Connect Postgres using PgCtxSetup
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseNpgsql(PgCtxSetup._postgres.GetConnectionString());// Uses the test base.
            });
        });

        return base.CreateHost(builder);
    }
}
