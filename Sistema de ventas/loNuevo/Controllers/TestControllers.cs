using Microsoft.AspNetCore.Mvc;

namespace loNuevo.Controllers;

[ApiController]
[ApiVersion("1.0")]
public class TestController : ControllerBase
{
    public TestController()
    {
        
    }

    [HttpGet("testMessage")]
    public string Test() 
    {
        return "Test Controller";
    }
}