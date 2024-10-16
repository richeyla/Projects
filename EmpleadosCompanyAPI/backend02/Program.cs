var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Configuración para el entorno de desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();    // Habilitar Swagger en desarrollo
    app.UseSwaggerUI();  // Interfaz de Swagger para probar la API
}

var companias = new List<Compania>(); // Lista de compañías
var empleados = new List<Empleado>(); // Lista de empleados
var companiaIdCounter = 1;
var empleadoIdCounter = 1;

// ==================== CRUD para Compañías ==================== //

// Obtener todas las compañías
app.MapGet("/companias", () => companias); 

// Obtener una compañía por su ID
app.MapGet("/companias/{id}", (int id) => 
{
    var compania = companias.FirstOrDefault(c => c.Id == id);  // Busca la compañía con el ID proporcionado
    return compania is not null ? Results.Ok(compania) : Results.NotFound();  // Si la encuentra, la devuelve; si no, devuelve 404
});

// Crear una nueva compañía
app.MapPost("/companias", (Compania compania) => 
{
    compania.Id = companiaIdCounter++;  // Asigna un ID a la nueva compañía
    companias.Add(compania);            // Agrega la compañía a la lista
    return Results.Created($"/companias/{compania.Id}", compania);  // Devuelve la respuesta de creación
});

// Actualizar una compañía existente
app.MapPut("/companias/{id}", (int id, Compania companiaActualizada) => 
{
    var compania = companias.FirstOrDefault(c => c.Id == id);  // Busca la compañía por su ID
    if (compania is null) return Results.NotFound();           // Si no la encuentra, devuelve 404
    compania.Nombre = companiaActualizada.Nombre;              // Actualiza el nombre
    return Results.Ok(compania);                               // Devuelve la compañía actualizada
});

// Eliminar una compañía
app.MapDelete("/companias/{id}", (int id) =>
{
    var compania = companias.FirstOrDefault(c => c.Id == id);  // Busca la compañía por su ID
    if (compania is null) return Results.NotFound();           // Si no existe, devuelve 404
    if (compania.Empleados.Any()) return Results.BadRequest("No se puede eliminar la compañía porque tiene empleados asociados.");  
    companias.Remove(compania);                                // Elimina la compañía
    return Results.NoContent();                                // Devuelve 204 cuando se elimina exitosamente
});

// Eliminar una compañía con empleados
app.MapDelete("/companias/eliminacion-Con-Empleados/{id}", (int id) =>
{
    var compania = companias.FirstOrDefault(c => c.Id == id);  // Busca la compañía por su ID
    if (compania is null) return Results.NotFound();           // Si no existe, devuelve 404
    companias.Remove(compania);                                // Elimina la compañía
    return Results.NoContent();                                // Devuelve 204 cuando se elimina exitosamente
});

// ==================== CRUD para Empleados ==================== //

// Obtener todos los empleados
app.MapGet("/empleados", () => empleados);  // Devuelve la lista completa de empleados

// Obtener un empleado por su ID
app.MapGet("/empleados/{id}", (int id) =>
{
    var empleado = empleados.FirstOrDefault(e => e.Id == id);  // Busca el empleado por su ID
    return empleado is not null ? Results.Ok(empleado) : Results.NotFound();  // Si lo encuentra, lo devuelve; si no, devuelve 404
});

// Crear un nuevo empleado
app.MapPost("/empleados", (Empleado empleado) =>
{
    var compania = companias.FirstOrDefault(c => c.Id == empleado.CompaniaId);  // Verifica si la compañía existe
    if (compania is null) return Results.BadRequest("Compañía no encontrada.");  // Si no existe, devuelve 400
    empleado.Id = empleadoIdCounter++;  // Asigna un ID único al nuevo empleado
    empleados.Add(empleado);            // Agrega el empleado a la lista de empleados
    compania.Empleados.Add(empleado);   // Agrega el empleado a la lista de empleados de la compañía
    return Results.Created($"/empleados/{empleado.Id}", empleado);  // Devuelve el resultado de creación
});

// Actualizar un empleado existente
app.MapPut("/empleados/{id}", (int id, Empleado empleadoActualizado) =>
{
    var empleado = empleados.FirstOrDefault(e => e.Id == id);  // Busca el empleado por su ID
    if (empleado is null) return Results.NotFound();           // Si no existe, devuelve 404
    empleado.Nombre = empleadoActualizado.Nombre;              // Actualiza el nombre del empleado
    return Results.Ok(empleado);                               // Devuelve el empleado actualizado
});

// Eliminar un empleado
app.MapDelete("/empleados/{id}", (int id) =>
{
    var empleado = empleados.FirstOrDefault(e => e.Id == id);  // Busca el empleado por su ID
    if (empleado is null) return Results.NotFound();           // Si no existe, devuelve 404
    var compania = companias.FirstOrDefault(c => c.Id == empleado.CompaniaId);  // Busca la compañía del empleado
    compania?.Empleados.Remove(empleado);  // Elimina al empleado de la lista de empleados de la compañía
    empleados.Remove(empleado);            // Elimina el empleado de la lista de empleados
    return Results.NoContent();            // Devuelve 204 cuando se elimina exitosamente
});

app.Run();
// ==================== Clases Modelo ==================== //

// Modelo de Compañía
public class Compania
{
    public int Id { get; set; }                     // Identificador único de la compañía
    public string? Nombre { get; set; }              // Nombre de la compañía
    public List<Empleado> Empleados { get; set; } = new List<Empleado>();  // Lista de empleados de la compañía
}

// Modelo de Empleado
public class Empleado
{
    public int Id { get; set; }         // Identificador único del empleado
    public string? Nombre { get; set; }  // Nombre del empleado
    public int CompaniaId { get; set; }  // ID de la compañía a la que pertenece el empleado
}
