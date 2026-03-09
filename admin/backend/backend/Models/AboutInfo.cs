using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models;

public class AboutInfo
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("bio")]
    public string Bio { get; set; } = string.Empty;

    [BsonElement("socials")]
    public Socials Socials { get; set; } = new();

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class Socials
{
    public string GitHub { get; set; } = string.Empty;
    public string LinkedIn { get; set; } = string.Empty;
    public string Instagram { get; set; } = string.Empty;
    public string Dribbble { get; set; } = string.Empty;
    public string Behance { get; set; } = string.Empty;
}
