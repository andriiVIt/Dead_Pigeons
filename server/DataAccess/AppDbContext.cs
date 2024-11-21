using System;
using System.Collections.Generic;
 
using DataAccess.models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public partial class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Player> Players { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Board> Boards { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Winner> Winners { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Player -> Board (One-to-Many)
            modelBuilder.Entity<Board>()
                .HasOne(b => b.Player)
                .WithMany(p => p.Boards)
                .HasForeignKey(b => b.PlayerId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            // Board -> Game (One-to-Many)
            modelBuilder.Entity<Board>()
                .HasOne(b => b.Game)
                .WithMany(g => g.Boards)
                .HasForeignKey(b => b.GameId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            // Game -> Winner (One-to-Many)
            modelBuilder.Entity<Winner>()
                .HasOne(w => w.Game)
                .WithMany(g => g.Winners)
                .HasForeignKey(w => w.GameId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            // Player -> Winner (One-to-Many)
            modelBuilder.Entity<Winner>()
                .HasOne(w => w.Player)
                .WithMany()
                .HasForeignKey(w => w.PlayerId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();

            // Player -> Transaction (One-to-Many)
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Player)
                .WithMany(p => p.Transactions)
                .HasForeignKey(t => t.PlayerId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            // Additional configurations
            modelBuilder.Entity<Player>()
                .Property(p => p.Balance)
                .HasColumnType("decimal(10, 2)")
                .HasDefaultValue(0);

            modelBuilder.Entity<Game>()
                .Property(g => g.WinningSequence)
                .HasColumnType("integer[]"); // PostgreSQL array type
        }
    }
}
