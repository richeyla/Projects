using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();

// Configurar el versionado de la API
builder.Services.AddApiVersioning(options =>
{
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.DefaultApiVersion = new Microsoft.AspNetCore.Mvc.ApiVersion(1, 0);
    options.ReportApiVersions = true;
});

// Configurar Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Sales API", Version = "v1" });
    c.SwaggerDoc("v2", new OpenApiInfo { Title = "Sales API", Version = "v2" });

    // Seguridad
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your token."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[] { }
        }
    });
});


// Setup JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "yourdomain.com",
            ValidAudience = "yourdomain.com",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("clave_secreta"))
        };
    });

builder.Services.AddAuthorization();


// Adding EF Core service and configuring SQL Server
builder.Services.AddDbContext<SalesDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SalesSystemDatabase")));

builder.Services.AddAuthorization();
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Sales API v1");
        c.SwaggerEndpoint("/swagger/v2/swagger.json", "Sales API v2");
    });
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// CRUD for Companies
app.MapGet("/companies", async (SalesDbContext db) => await db.Companies.ToListAsync())
    .RequireAuthorization();

app.MapGet("/companies/{id}", async (int id, SalesDbContext db) =>
{
    var company = await db.Companies.FindAsync(id);
    return company is not null ? Results.Ok(company) : Results.NotFound();
})
.RequireAuthorization();

app.MapPost("/companies", async (Company company, SalesDbContext db) =>
{
    db.Companies.Add(company);
    await db.SaveChangesAsync();
    return Results.Created($"/companies/{company.Id}", company);
})
.RequireAuthorization();

app.MapPut("/companies/{id}", async (int id, Company updatedCompany, SalesDbContext db) =>
{
    var company = await db.Companies.FindAsync(id);
    if (company is null) return Results.NotFound();

    company.Name = updatedCompany.Name;
    await db.SaveChangesAsync();
    return Results.Ok(company);
})
.RequireAuthorization();

app.MapDelete("/companies/{id}", async (int id, SalesDbContext db) =>
{
    var company = await db.Companies.Include(c => c.Employees).FirstOrDefaultAsync(c => c.Id == id);
    if (company is null) return Results.NotFound();
    if (company.Employees.Any()) return Results.BadRequest("Cannot delete company with employees.");

    db.Companies.Remove(company);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.RequireAuthorization();

// CRUD for Employees
app.MapGet("/employees", async (SalesDbContext db) => await db.Employees.ToListAsync())
    .RequireAuthorization();

app.MapPost("/employees", async (Employee employee, SalesDbContext db) =>
{
    var company = await db.Companies.FindAsync(employee.CompanyId);
    if (company is null) return Results.BadRequest("Company not found.");

    db.Employees.Add(employee);
    await db.SaveChangesAsync();
    return Results.Created($"/employees/{employee.Id}", employee);
})
.RequireAuthorization();

// CRUD for Articles
app.MapGet("/articles", async (SalesDbContext db) => await db.Articles.Include(a => a.Company).ToListAsync())
    .RequireAuthorization();

app.MapPost("/articles", async (Article article, SalesDbContext db) =>
{
    var company = await db.Companies.FindAsync(article.CompanyId);
    if (company is null) return Results.BadRequest("Company not found.");

    db.Articles.Add(article);
    await db.SaveChangesAsync();
    return Results.Created($"/articles/{article.Id}", article);
})
.RequireAuthorization();

// CRUD for Orders
app.MapGet("/orders", async (SalesDbContext db) => await db.Orders.Include(o => o.Employee).Include(o => o.OrderDetails).ToListAsync())
    .RequireAuthorization();

app.MapPost("/orders", async (Order order, SalesDbContext db) =>
{
    var employee = await db.Employees.FindAsync(order.EmployeeId);
    if (employee is null) return Results.BadRequest("Employee not found.");

    // Check if articles belong to the same company
    var company = await db.Companies.FindAsync(employee.CompanyId);
    if (company is null || order.OrderDetails.Any(od => !db.Articles.Any(a => a.Id == od.ArticleId && a.CompanyId == company.Id)))
        return Results.BadRequest("All articles must belong to the same company as the employee.");

    db.Orders.Add(order);
    await db.SaveChangesAsync();
    return Results.Created($"/orders/{order.Id}", order);
})
.RequireAuthorization();

// CRUD for Invoices
app.MapGet("/invoices", async (SalesDbContext db) => await db.Invoices.Include(i => i.Order).ToListAsync())
    .RequireAuthorization();

// Login endpoint to generate JWT
app.MapPost("/login", async (UserLogin login, SalesDbContext db) =>
{
    var employee = await db.Employees.FirstOrDefaultAsync(e => e.Name == login.Username && e.Password == login.Password);
    if (employee is not null)
    {
        var token = GenerateJwtToken(employee);
        return Results.Ok(new { token });
    }
    return Results.Unauthorized();
});

// Function to generate the JWT
string GenerateJwtToken(Employee employee)
{
    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, employee.Name),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("super_secure_key_that_is_longer_than_32_characters"));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: "yourdomain.com",
        audience: "yourdomain.com",
        claims: claims,
        expires: DateTime.Now.AddMinutes(30),
        signingCredentials: creds);

    return new JwtSecurityTokenHandler().WriteToken(token);
}

// Map controllers for different versions
app.MapControllers();

// Run the application
app.Run();

// Database context
public class SalesDbContext : DbContext
{
    public SalesDbContext(DbContextOptions<SalesDbContext> options) : base(options) { }

    public DbSet<Company> Companies { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Article> Articles { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderDetail> OrderDetails { get; set; }
    public DbSet<Invoice> Invoices { get; set; }
}

// Models
public class Company
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public List<Employee> Employees { get; set; } = new();
    public List<Article> Articles { get; set; } = new();
}

public class Employee
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string Password { get; set; } = default!;
    public int CompanyId { get; set; }
    public Company Company { get; set; } = default!;
}

public class Article
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public decimal Value { get; set; }
    public int CompanyId { get; set; }
    public Company Company { get; set; } = default!;
}

public class Order
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public int EmployeeId { get; set; }
    public Employee Employee { get; set; } = default!;
    public decimal TotalValue { get; set; }
    public string Status { get; set; } = default!;
    public List<OrderDetail> OrderDetails { get; set; } = new();
}

public class OrderDetail
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order Order { get; set; } = default!;
    public int ArticleId { get; set; }
    public Article Article { get; set; } = default!;
    public int Quantity { get; set; }
}

public class Invoice
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order Order { get; set; } = default!;
    public decimal TotalAmount { get; set; }
}

public class UserLogin
{
    public string Username { get; set; } = default!;
    public string Password { get; set; } = default!;
}
