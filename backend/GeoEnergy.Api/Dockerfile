
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["backend/GeoEnergy.Api/GeoEnergy.Api.csproj", "backend/GeoEnergy.Api/"]
RUN dotnet restore "backend/GeoEnergy.Api/GeoEnergy.Api.csproj"

COPY . .
WORKDIR /src/backend/GeoEnergy.Api
RUN dotnet publish "GeoEnergy.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "GeoEnergy.Api.dll"]
