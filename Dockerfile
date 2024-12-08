# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source
# 
# Copy solution and project files
COPY *.sln ./
COPY server/API/*.csproj ./server/API/
COPY server/DataAccess/*.csproj ./server/DataAccess/
COPY server/Service/*.csproj ./server/Service/
COPY server/ApiIntegrationTests/*.csproj ./server/ApiIntegrationTests/
RUN dotnet restore  

# Copy the rest of the files and build the project
COPY server/API/. ./server/API/
COPY server/DataAccess/. ./server/DataAccess/
COPY server/Service/. ./server/Service/
COPY server/ApiIntegrationTests/. ./server/ApiIntegrationTests/
RUN dotnet publish -c release -o /app --no-restore

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
 # Copy the published output from the build stage
COPY --from=build /app ./
# Entry point for the application
ENTRYPOINT ["dotnet", "API.dll"]
