using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace SalesSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TestControllers : ControllerBase
    {
        private readonly SalesDbContext _context;

        public TestControllers(SalesDbContext context)
        {
            _context = context;
        }

        // V1: Obtener todos los artículos
        [HttpGet("v1/articles")]
        public async Task<IActionResult> GetArticlesV1()
        {
            var articles = await _context.Articles.ToListAsync();
            return Ok(articles);
        }

        // V1: Obtener todas las empresas
        [HttpGet("v1/companies")]
        public async Task<IActionResult> GetCompaniesV1()
        {
            var companies = await _context.Companies.ToListAsync();
            return Ok(companies);
        }

        // V1: Crear una nueva empresa
        [HttpPost("v1/companies")]
        public async Task<IActionResult> CreateCompanyV1([FromBody] Company company)
        {
            _context.Companies.Add(company);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCompaniesV1), new { id = company.Id }, company);
        }

        // V2: Obtener todos los artículos
        [HttpGet("v2/articles")]
        public async Task<IActionResult> GetArticlesV2()
        {
            var articles = await _context.Articles.ToListAsync();
            return Ok(articles);
        }

        // V2: Obtener todas las empresas
        [HttpGet("v2/companies")]
        public async Task<IActionResult> GetCompaniesV2()
        {
            var companies = await _context.Companies.ToListAsync();
            return Ok(companies);
        }

        // V2: Crear un nuevo artículo
        [HttpPost("v2/articles")]
        public async Task<IActionResult> CreateArticleV2([FromBody] Article article)
        {
            _context.Articles.Add(article);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetArticlesV2), new { id = article.Id }, article);
        }

        // V2: Crear una nueva orden
        [HttpPost("v2/orders")]
        public async Task<IActionResult> CreateOrderV2([FromBody] Order order)
        {
            var employee = await _context.Employees.FindAsync(order.EmployeeId);
            if (employee is null) return BadRequest("Employee not found.");

            // Validación simplificada: solo asegurarse de que los artículos existen
            foreach (var od in order.OrderDetails)
            {
                var article = await _context.Articles.FindAsync(od.ArticleId);
                if (article == null)
                {
                    return BadRequest($"Article with ID {od.ArticleId} not found.");
                }
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetOrdersV2), new { id = order.Id }, order);
        }

        // V2: Obtener todas las órdenes
        [HttpGet("v2/orders")]
        public async Task<IActionResult> GetOrdersV2()
        {
            var orders = await _context.Orders.Include(o => o.Employee).ToListAsync();
            return Ok(orders);
        }
    }
}
