using NorthwindAPI.Repositories;

var builder = WebApplication.CreateBuilder(args);

// --------------------------------------
// ✨ Service Configuration
// --------------------------------------
builder.Services.AddControllers();
builder.Services.AddScoped<ProductRepository>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ CORS Policy
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

// --------------------------------------
// 🚀 Middleware Pipeline
// --------------------------------------

// 🔧 Swagger in Development Only
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();       // ⚠️ Must come before UseCors
app.UseCors("AllowAll");
app.UseAuthorization();

app.MapControllers();   // ✅ Maps routes from controllers

app.Run();
