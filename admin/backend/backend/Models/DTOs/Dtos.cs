namespace backend.Models.DTOs;

// ── Projects ───────────────────────────────────────────────────────

public record CreateProjectDto(
    string Title,
    string Subtitle,
    string Description,
    string Github,
    string Live,
    string ImageUrl,
    List<string> Tags,
    bool Featured,
    int Order
);

public record UpdateProjectDto(
    string? Title,
    string? Subtitle,
    string? Description,
    string? Github,
    string? Live,
    string? ImageUrl,
    List<string>? Tags,
    bool? Featured,
    int? Order
);

// ── Auth ───────────────────────────────────────────────────────────

public record LoginDto(string Username, string Password);

public record AuthResponseDto(string Token, string Username);
