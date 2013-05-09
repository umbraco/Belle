using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Newtonsoft.Json.Linq;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;

namespace Umbraco.Belle.Controllers
{
    [PluginController("UmbracoEditors")]
    public class ContentEditorApiController : UmbracoApiController
    {
        /// <summary>
        /// Saves content
        /// </summary>
        /// <returns></returns>
        public HttpResponseMessage PostSaveContent(JArray values)
        {
            return Request.CreateResponse(HttpStatusCode.OK, "success!");
        }

    }
}
