using backend.Models;
using backend.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace backend.Services;

public class AboutService
{
    private readonly IMongoCollection<AboutInfo> _about;

    public AboutService(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _about = database.GetCollection<AboutInfo>("about");
    }

    public async Task<AboutInfo> GetAsync()
    {
        var info = await _about.Find(_ => true).FirstOrDefaultAsync();
        if (info == null)
        {
            info = new AboutInfo { Bio = "Bio not set yet." };
            await _about.InsertOneAsync(info);
        }
        return info;
    }

    public async Task UpdateAsync(AboutInfo updated)
    {
        updated.UpdatedAt = DateTime.UtcNow;
        var existing = await _about.Find(_ => true).FirstOrDefaultAsync();
        if (existing == null)
        {
            await _about.InsertOneAsync(updated);
        }
        else
        {
            updated.Id = existing.Id;
            await _about.ReplaceOneAsync(a => a.Id == existing.Id, updated);
        }
    }
}
