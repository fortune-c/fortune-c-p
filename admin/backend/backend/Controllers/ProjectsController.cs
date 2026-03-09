using backend.Models;
using backend.Models.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController(ProjectService projectService) : ControllerBase
{
    // ── PUBLIC ───────────────────────────────────────────────────────

    /// <summary>GET /api/projects — returns all projects ordered by Order field</summary>
    [HttpGet]
    public async Task<ActionResult<List<Project>>> GetAll() =>
        Ok(await projectService.GetAllAsync());

    /// <summary>GET /api/projects/featured — returns only featured projects</summary>
    [HttpGet("featured")]
    public async Task<ActionResult<List<Project>>> GetFeatured() =>
        Ok(await projectService.GetFeaturedAsync());

    /// <summary>GET /api/projects/{id}</summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Project>> GetById(string id)
    {
        var project = await projectService.GetByIdAsync(id);
        return project is null ? NotFound() : Ok(project);
    }

    // ── ADMIN ONLY ───────────────────────────────────────────────────

    /// <summary>POST /api/projects — create a new project</summary>
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Project>> Create([FromBody] CreateProjectDto dto)
    {
        var project = new Project
        {
            Title = dto.Title,
            Subtitle = dto.Subtitle,
            Description = dto.Description,
            Github = dto.Github,
            Live = dto.Live,
            ImageUrl = dto.ImageUrl,
            Tags = dto.Tags,
            Featured = dto.Featured,
            Order = dto.Order
        };

        var created = await projectService.CreateAsync(project);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>PUT /api/projects/{id} — update an existing project</summary>
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateProjectDto dto)
    {
        var existing = await projectService.GetByIdAsync(id);
        if (existing is null) return NotFound();

        existing.Title = dto.Title ?? existing.Title;
        existing.Subtitle = dto.Subtitle ?? existing.Subtitle;
        existing.Description = dto.Description ?? existing.Description;
        existing.Github = dto.Github ?? existing.Github;
        existing.Live = dto.Live ?? existing.Live;
        existing.ImageUrl = dto.ImageUrl ?? existing.ImageUrl;
        existing.Tags = dto.Tags ?? existing.Tags;
        existing.Featured = dto.Featured ?? existing.Featured;
        existing.Order = dto.Order ?? existing.Order;

        var updated = await projectService.UpdateAsync(id, existing);
        return updated ? NoContent() : StatusCode(500, "Update failed");
    }

    /// <summary>DELETE /api/projects/{id}</summary>
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await projectService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
