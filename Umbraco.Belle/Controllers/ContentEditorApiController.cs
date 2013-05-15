using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Newtonsoft.Json.Linq;
using Umbraco.Belle.Models;
using Umbraco.Belle.System;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;

namespace Umbraco.Belle.Controllers
{
    [PluginController("UmbracoEditors")]
    public class ContentEditorApiController : UmbracoApiController
    {

        /// <summary>
        /// Remove the xml formatter... only support JSON!
        /// </summary>
        /// <param name="controllerContext"></param>
        protected override void Initialize(global::System.Web.Http.Controllers.HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            controllerContext.Configuration.Formatters.Remove(controllerContext.Configuration.Formatters.XmlFormatter);
        }

        /// <summary>
        /// Gets the content json for the content id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public object GetContent(int id)
        {
            return TestContentService.GetContentItem(id);
        }

        /// <summary>
        /// Saves content
        /// </summary>
        /// <returns></returns>
        public HttpResponseMessage PostSaveContent(ContentItem contentItem)
        {
            return Request.CreateResponse(HttpStatusCode.OK, "success!");
        }

    }
}
