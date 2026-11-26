
using GeoEnergy.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GeoEnergy.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Make sure the database and tables exist.
        await context.Database.MigrateAsync();

        var passwordHasher = new PasswordHasher<User>();

        var users = new List<User>
        {
            new User
            {
                Username = "ahmed",
                FullName = "Ahmed",
                Role = "Engineer",
                Department = "Exploration"
            },
            new User
            {
                Username = "sara",
                FullName = "Sara",
                Role = "Engineer",
                Department = "Production"
            },
            new User
            {
                Username = "mona",
                FullName = "Mona",
                Role = "Manager",
                Department = "Management"
            }
        };

        foreach (var user in users)
        {
            bool userExists = await context.Users
                .AnyAsync(u => u.Username == user.Username);

            if (!userExists)
            {
                string? password = Environment.GetEnvironmentVariable(
         $"SEED_{user.Username.ToUpper()}_PASSWORD"
     );

                if (string.IsNullOrWhiteSpace(password))
                {
                    throw new InvalidOperationException(
                        $"Missing password for seed user: {user.Username}"
                    );
                }

                user.PasswordHash = passwordHasher.HashPassword(user, password);

                context.Users.Add(user);
            }
        }

        await context.SaveChangesAsync();
    }
}
