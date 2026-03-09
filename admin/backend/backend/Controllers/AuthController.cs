using backend.Models.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AuthService authService) : ControllerBase
{
    /// <summary>
    /// POST /api/auth/login
    /// Returns a JWT token if credentials are valid.
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
    {
        var admin = await authService.FindAdminAsync(dto.Username);
        if (admin is null || !authService.VerifyPassword(dto.Password, admin.PasswordHash))
            return Unauthorized(new { message = "Invalid username or password." });

        var token = authService.GenerateToken(admin);
        return Ok(new AuthResponseDto(token, admin.Username));
    }

    /// <summary>
    /// POST /api/auth/setup
    /// Seeds the very first admin account. Disabled once an admin exists.
    /// </summary>
    [HttpPost("setup")]
    public async Task<IActionResult> Setup([FromBody] LoginDto dto)
    {
        if (await authService.AdminExistsAsync())
            return Conflict(new { message = "Admin already exists. Use /login." });

        var admin = await authService.CreateAdminAsync(dto.Username, dto.Password);
        return Ok(new { message = "Admin created.", username = admin.Username });
    }

    /// <summary>GET /api/auth/me — returns current authenticated admin info</summary>
    [Authorize(Roles = "Admin")]
    [HttpGet("me")]
    public IActionResult Me() =>
        Ok(new { username = User.Identity?.Name });
}
