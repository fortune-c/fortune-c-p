using backend.Middleware;
using backend.Services;
using backend.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ── Settings ─────────────────────────────────────────────────────────
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDb"));

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt"));

// ── Services ──────────────────────────────────────────────────────────
builder.Services.AddSingleton<ProjectService>();
builder.Services.AddSingleton<AuthService>();
builder.Services.AddSingleton<AboutService>();

// ── CORS ──────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("PortfolioFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:8080",   // local dev server
                "http://127.0.0.1:8080",
                "http://localhost:3000",   // npm run serve
                "https://fortune-c.github.io",
                "https://fortune-c-p.vercel.app",
                "https://fortune-c.vercel.app" 
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ── JWT Authentication ────────────────────────────────────────────────
var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>()!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings.Secret))
        };
    });

builder.Services.AddAuthorization();

// ── Controllers & OpenAPI ─────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddHealthChecks()
    .AddCheck<MongoHealthCheck>("mongodb");

var app = builder.Build();

// ── Middleware pipeline ───────────────────────────────────────────────
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("PortfolioFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
