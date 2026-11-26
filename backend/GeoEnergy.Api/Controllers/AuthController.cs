
using GeoEnergy.Api.DTOs.Auth;
using GeoEnergy.Api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace GeoEnergy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);

        if (result == null)
        {
            return Unauthorized(new
            {
                message = "Invalid username or password."
            });
        }

        return Ok(result);
    }



    [Authorize]
    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var username = User.FindFirstValue(ClaimTypes.Name);
        var fullName = User.FindFirstValue("FullName");
        var role = User.FindFirstValue(ClaimTypes.Role);
        var department = User.FindFirstValue("Department");

        if (userId == null)
            return Unauthorized();

        var response = new CurrentUserResponse
        {
            UserId = int.Parse(userId),
            Username = username ?? string.Empty,
            FullName = fullName ?? string.Empty,
            Role = role ?? string.Empty,
            Department = department ?? string.Empty
        };

        return Ok(response);
    }

}
