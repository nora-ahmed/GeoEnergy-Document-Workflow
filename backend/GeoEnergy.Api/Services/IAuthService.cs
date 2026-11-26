
using GeoEnergy.Api.DTOs.Auth;

namespace GeoEnergy.Api.Services;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
}
