using backend.Models;
using backend.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace backend.Services;

public class ProjectService
{
    private readonly IMongoCollection<Project> _projects;

    public ProjectService(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _projects = database.GetCollection<Project>(settings.Value.ProjectsCollection);
    }

    public async Task<List<Project>> GetAllAsync() =>
        await _projects.Find(_ => true).SortBy(p => p.Order).ToListAsync();

    public async Task<List<Project>> GetFeaturedAsync() =>
        await _projects.Find(p => p.Featured).SortBy(p => p.Order).ToListAsync();

    public async Task<Project?> GetByIdAsync(string id) =>
        await _projects.Find(p => p.Id == id).FirstOrDefaultAsync();

    public async Task<Project> CreateAsync(Project project)
    {
        await _projects.InsertOneAsync(project);
        return project;
    }

    public async Task<bool> UpdateAsync(string id, Project updated)
    {
        updated.UpdatedAt = DateTime.UtcNow;
        var result = await _projects.ReplaceOneAsync(p => p.Id == id, updated);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _projects.DeleteOneAsync(p => p.Id == id);
        return result.DeletedCount > 0;
    }
}
