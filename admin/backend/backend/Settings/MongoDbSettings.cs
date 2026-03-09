namespace backend.Settings;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;

    // Collection names
    public string ProjectsCollection { get; set; } = "projects";
    public string AdminsCollection { get; set; } = "admins";
}
