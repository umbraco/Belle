using System.Web.Mvc;

namespace Umbraco.Belle.Controllers
{

    public class ServerSidePropertyEditorsController : Controller
    {
        [HttpGet]
        public ActionResult ServerEnvironment()
        {
            return View();
        }

    }
}
