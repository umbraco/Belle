using System.IO;
using System.Web;
using System.Web.Mvc;
using Umbraco.Belle.System;
using Umbraco.Core;

namespace Umbraco.Belle.Controllers
{
    public class MainController : Controller
    {
       
        /// <summary>
        /// Returns the main.js including all references found in manifests
        /// </summary>
        /// <returns></returns>
        public JavaScriptResult MainJs()
        {
            var parser = new ManifestParser(new DirectoryInfo(Server.MapPath("~/App_Plugins")));
            var result = parser.Process();
            return JavaScript(result);
        }

        public ActionResult Index()
        {
            return View();
        }

    }
}
