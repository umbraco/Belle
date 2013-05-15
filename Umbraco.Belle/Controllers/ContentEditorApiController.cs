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
            var urlHelper = new UrlHelper(new RequestContext(new HttpContextWrapper(HttpContext.Current), new RouteData()));

            return new ContentItem
                {
                    Id = id,
                    Name = "Test Item",
                    Properties = new List<ContentProperty>
                        {
                            new ContentProperty
                                {
                                    Alias = "numbers",
                                    Id = 10,
                                    Label = "Numbers",
                                    Description = "Enter a numeric value",
                                    Value = "12345987765",
                                    Config = "^\\d*$",
                                    View = "/App_Plugins/MyPackage/PropertyEditors/Views/RegexEditor.html"
                                },
                            new ContentProperty
                                {
                                    Alias = "serverEnvironment",
                                    Id = 11,
                                    Label = "Server Info",
                                    Description = "Some server information",
                                    Value = "",
                                    Config = "",
                                    View = urlHelper.Action("ServerEnvironment", "ServerSidePropertyEditors", new {area = "MyPackage"})
                                },
                            new ContentProperty
                                {
                                    Alias = "complexEditor",
                                    Id = 12,
                                    Label = "Multiple Values",
                                    Description = "A multi value editor",
                                    Value = "My Value 1, My Value 2, My Value 3, My Value 4, My Value 5",
                                    Config = "",
                                    View = "/App_Plugins/MyPackage/PropertyEditors/Views/CsvEditor.html"
                                }
                        }
                };
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
