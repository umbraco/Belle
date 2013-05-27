using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;

using System.Web.Routing;
using Newtonsoft.Json.Linq;
using Umbraco.Belle.Models;
using Umbraco.Belle.System;
using Umbraco.Belle.System.Mvc;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;

namespace Umbraco.Belle.Controllers
{
    [PluginController("UmbracoEditors")]
    [ValidationFilter]
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
            var foundContent = TestContentService.GetContentItemForDisplay(id);
            if (foundContent == null)
            {
                ModelState.AddModelError("id", string.Format("content with id: {0} was not found", id));

                var errorResponse = Request.CreateErrorResponse(
                    HttpStatusCode.NotFound,
                    ModelState);
                throw new HttpResponseException(errorResponse);
            }
            return foundContent;
        }

        /// <summary>
        /// Saves content
        /// </summary>
        /// <returns></returns>
        [ContentItemValidationFilter]
        [FileUploadCleanupFilter]
        public HttpResponseMessage PostSaveContent(
            [ModelBinder(typeof(ContentItemBinder))]
            ContentItemSave contentItem)
        {
            //If we've reached here it means:
            // * Our model has been bound
            // * and validated
            // * any file attachments have been saved to their temporary location for us to use

            return Request.CreateResponse(HttpStatusCode.OK, "success!");
        }

    }
}
