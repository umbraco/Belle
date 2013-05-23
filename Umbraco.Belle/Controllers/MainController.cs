using System.IO;
using System.Web;
using System.Web.Mvc;
using Umbraco.Belle.System;
using Umbraco.Core;

namespace Umbraco.Belle.Controllers
{
    public class MainController : Controller
    {
       
        public ActionResult Index()
        {
            return View();
        }

    }
}
