# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

# Copy project files and restore
COPY ["backend/backend.csproj", "backend/"]
RUN dotnet restore "backend/backend.csproj"

# Copy everything and build
COPY . .
RUN dotnet publish "backend/backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render uses the PORT environment variable, but ASP.NET Core 
# needs to be told to listen on it. 
# We'll use the environment variable mapping in Render settings instead
# to set ASPNETCORE_URLS=http://0.0.0.0:8080

EXPOSE 8080
ENTRYPOINT ["dotnet", "backend.dll"]
