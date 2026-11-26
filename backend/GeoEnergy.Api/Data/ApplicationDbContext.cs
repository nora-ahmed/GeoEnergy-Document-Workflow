
using GeoEnergy.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GeoEnergy.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<DocumentVersion> DocumentVersions => Set<DocumentVersion>();
    public DbSet<DocumentHistory> DocumentHistory => Set<DocumentHistory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Username).IsUnique();

            entity.Property(u => u.Username)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(u => u.FullName)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(u => u.Role)
                .IsRequired()
                .HasMaxLength(20);

            entity.Property(u => u.Department)
                .IsRequired()
                .HasMaxLength(100);
        });

        // Document configuration
        modelBuilder.Entity<Document>(entity =>
        {
            entity.Property(d => d.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(d => d.Status)
                .IsRequired()
                .HasMaxLength(30);

            entity.HasOne(d => d.UploadedBy)
                .WithMany(u => u.UploadedDocuments)
                .HasForeignKey(d => d.UploadedById)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(d => d.ReviewedBy)
                .WithMany()
                .HasForeignKey(d => d.ReviewedById)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // DocumentVersion configuration
        modelBuilder.Entity<DocumentVersion>(entity =>
        {
            entity.HasIndex(v => new { v.DocumentId, v.VersionNumber })
                .IsUnique();

            entity.HasOne(v => v.Document)
                .WithMany(d => d.Versions)
                .HasForeignKey(v => v.DocumentId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(v => v.UploadedBy)
                .WithMany()
                .HasForeignKey(v => v.UploadedById)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // DocumentHistory configuration
        modelBuilder.Entity<DocumentHistory>(entity =>
        {
            entity.HasOne(h => h.Document)
                .WithMany(d => d.History)
                .HasForeignKey(h => h.DocumentId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(h => h.User)
                .WithMany(u => u.HistoryEntries)
                .HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.Property(h => h.Action)
                .IsRequired()
                .HasMaxLength(50);
        });
    }
}
