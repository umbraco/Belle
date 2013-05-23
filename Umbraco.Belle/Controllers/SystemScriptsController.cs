using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using Umbraco.Belle.Resources;
using Umbraco.Belle.System;
using Umbraco.Web;
using Umbraco.Core;

namespace Umbraco.Belle.Controllers
{
    /// <summary>
    /// A controller to return javascript content from the server
    /// </summary>
    public class SystemScriptsController : Controller
    {

        /// <summary>
        /// Returns the RequireJS file including all references found in manifests
        /// </summary>
        /// <returns></returns>
        public JavaScriptResult Application()
        {
            var parser = new ManifestParser(new DirectoryInfo(Server.MapPath("~/App_Plugins")));
            var result = parser.GetJavascriptInitialization();
            return JavaScript(result);
        }
        
        /// <summary>
        /// Returns the JavaScript object representing the static server variables javascript object
        /// </summary>
        /// <returns></returns>
        public JavaScriptResult ServerVariables()
        {            
            //now we need to build up the variables
            var d = new Dictionary<string, object>();
            
            d.Add("umbracoPath", Url.Content("~/Umbraco")); //TODO: obviously we should be using the umbraco config            
            d.Add("contentEditorApiBaseUrl", Url.GetUmbracoApiService<ContentEditorApiController>("PostSaveContent").TrimEnd("PostSaveContent"));

            return JavaScript(ServerVariablesParser.Parse(d));
        }

    }
}
