using System.Security.Claims;
using GeoEnergy.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GeoEnergy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public NotificationsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications()
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var notifications = await _context.Notifications
            .AsNoTracking()
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new
            {
                n.Id,
                n.DocumentId,
                n.Type,
                n.Title,
                n.Message,
                n.CreatedAt
            })
            .ToListAsync();

        return Ok(notifications);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetNotificationById(int id)
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var notification = await _context.Notifications
            .AsNoTracking()
            .Where(n => n.Id == id && n.UserId == userId)
            .Select(n => new
            {
                n.Id,
                n.DocumentId,
                n.Type,
                n.Title,
                n.Message,
                n.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (notification == null)
            return NotFound(new
            {
                message = "Notification not found."
            });

        return Ok(notification);
    }
}