namespace GeoEnergy.Api.DTOs.Documents;

public class ManagerDashboardChartsDto
{
    public List<DashboardStatusCountDto> StatusCounts { get; set; } = new();
    public List<DashboardDepartmentCountDto> DepartmentCounts { get; set; } = new();
}

public class DashboardStatusCountDto
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class DashboardDepartmentCountDto
{
    public string Department { get; set; } = string.Empty;
    public int Count { get; set; }
}