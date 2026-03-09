using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AboutController(AboutService aboutService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<AboutInfo>> Get()
    {
        return Ok(await aboutService.GetAsync());
    }

    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<IActionResult> Update([FromBody] AboutInfo info)
    {
        await aboutService.UpdateAsync(info);
        return Ok(new { message = "About information updated." });
    }
}
