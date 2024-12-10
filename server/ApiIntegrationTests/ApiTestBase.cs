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
    public IServiceProvider ApplicationServices { get; set; }
     
    private protected readonly string _jwtToken = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJleHAiOjE3MzQyOTgyODQsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJhZG1pbkBleGFtcGxlLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiZWYxZmY2ZTMtNzU0OC00NjMwLWE0NGItNjFhM2NlYTZlZWY2IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJjdXJyZW50RGF0ZSI6IjIwMjQtMTItMDgiLCJpYXQiOjE3MzM2OTM0ODQsIm5iZiI6MTczMzY5MzQ4NH0.g4S0eGTWsDYbNHwgcczUbTKBNpTJMbuV8x61jHTVX1bttVsHsfCRwb_PWIGgqgCaeThgvw207RNS0b65GPKt1A";
    public ApiTestBase()
    {
        PgCtxSetup = new PgCtxSetup<AppDbContext>();
        ApplicationServices = Services.CreateScope().ServiceProvider;
        Client = CreateClient();
        using (var scope = ApplicationServices.CreateScope())
        {
            var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            ctx.Database.Migrate();
        }

        Seed().Wait();
        // Якщо потрібно, можна додати авторизацію
         Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJleHAiOjE3MzQyOTgyODQsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJhZG1pbkBleGFtcGxlLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiZWYxZmY2ZTMtNzU0OC00NjMwLWE0NGItNjFhM2NlYTZlZWY2IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJjdXJyZW50RGF0ZSI6IjIwMjQtMTItMDgiLCJpYXQiOjE3MzM2OTM0ODQsIm5iZiI6MTczMzY5MzQ4NH0.g4S0eGTWsDYbNHwgcczUbTKBNpTJMbuV8x61jHTVX1bttVsHsfCRwb_PWIGgqgCaeThgvw207RNS0b65GPKt1A");

        Seed().Wait();
    }

    
    public async Task Seed()
    {
        using var scope = ApplicationServices.CreateScope();
        var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        ctx.Database.Migrate();
        if (!await roleManager.RoleExistsAsync(Role.Admin))
        {
            await roleManager.CreateAsync(new IdentityRole(Role.Admin));
        }

        if (!await roleManager.RoleExistsAsync(Role.Player))
        {
            await roleManager.CreateAsync(new IdentityRole(Role.Player));
        }
        // Додайте тестового адміністратора
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
        // Створимо тестову гру
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
            logging.ClearProviders();
            logging.AddConsole();
            logging.SetMinimumLevel(LogLevel.Debug);
        });
        builder.ConfigureServices(services =>
        {
            // Видаляємо оригінальний DbContext
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
            if (descriptor != null) services.Remove(descriptor);

            // Підключаємо Postgres з використанням PgCtxSetup
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseNpgsql(PgCtxSetup._postgres.GetConnectionString());
            });
        });

        return base.CreateHost(builder);
    }
}
