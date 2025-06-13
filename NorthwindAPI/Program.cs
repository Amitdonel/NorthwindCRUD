using NorthwindAPI.Repositories;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------
// ✨ Service Configuration (Dependency Injection Setup)
// ---------------------------------------------------
builder.Services.AddControllers();                         // Add MVC controller support
builder.Services.AddScoped<ProductRepository>();           // Register custom repository as scoped (1 per HTTP request)
builder.Services.AddEndpointsApiExplorer();                // Enable minimal APIs to appear in Swagger
builder.Services.AddSwaggerGen();                          // Enable Swagger documentation generator

// ✅ Configure CORS to allow frontend to access API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// ---------------------------------------------------
// 🚀 Middleware Pipeline (Request handling flow)
// ---------------------------------------------------

// 🔧 Swagger enabled only in Development (not Production)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();     // Force HTTPS instead of HTTP
app.UseRouting();              // Set up routing for controller endpoints
app.UseCors("AllowAll");       // Apply the defined CORS policy
app.UseAuthorization();        // Enable [Authorize] support (even if not yet used)

// ✅ Map attribute-routed controllers (e.g., [Route("api/product")])
app.MapControllers();

app.Run();                     // Start the app
