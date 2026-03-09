using backend.Models;
using backend.Settings;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace backend.Services;

public class AuthService
{
    private readonly IMongoCollection<Admin> _admins;
    private readonly JwtSettings _jwtSettings;

    public AuthService(IOptions<MongoDbSettings> mongoSettings, IOptions<JwtSettings> jwtSettings)
    {
        var client = new MongoClient(mongoSettings.Value.ConnectionString);
        var database = client.GetDatabase(mongoSettings.Value.DatabaseName);
        _admins = database.GetCollection<Admin>(mongoSettings.Value.AdminsCollection);
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<Admin?> FindAdminAsync(string username) =>
        await _admins.Find(a => a.Username == username).FirstOrDefaultAsync();

    public async Task<bool> AdminExistsAsync() =>
        await _admins.CountDocumentsAsync(_ => true) > 0;

    /// <summary>Seeds the first admin. Call once on first run; disabled after an admin exists.</summary>
    public async Task<Admin> CreateAdminAsync(string username, string password)
    {
        var admin = new Admin
        {
            Username = username,
            PasswordHash = HashPassword(password)
        };
        await _admins.InsertOneAsync(admin);
        return admin;
    }

    public bool VerifyPassword(string password, string hash) =>
        HashPassword(password) == hash;

    public string GenerateToken(Admin admin)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, admin.Id!),
            new Claim(ClaimTypes.Name, admin.Username),
            new Claim(ClaimTypes.Role, "Admin")
        };

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string HashPassword(string password)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
        return Convert.ToHexString(bytes);
    }
}
