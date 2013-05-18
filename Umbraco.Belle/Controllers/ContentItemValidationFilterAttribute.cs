using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Umbraco.Belle.Models;
using Umbraco.Belle.System;

namespace Umbraco.Belle.Controllers
{
    /// <summary>
    /// Validates the content item
    /// </summary>
    /// <remarks>
    /// There's various validation happening here both value validation and structure validation
    /// to ensure that malicious folks are not trying to post invalid values or to invalid properties.
    /// </remarks>
    internal class ContentItemValidationFilterAttribute : ActionFilterAttribute
    {
        /// <summary>
        /// Performs the validation
        /// </summary>
        /// <param name="actionContext"></param>
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            var contentItem = actionContext.ActionArguments["contentItem"] as ContentItemSave;
            if (contentItem == null)
            {
                actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "No " + typeof(ContentItemSave) + " found in request");
                return;
            }

            //now do each validation step
            ContentItemDisplay existingContent;
            if (!ValidateExistingContent(contentItem, actionContext, out existingContent)) return;
            if (!ValidateProperties(contentItem, existingContent, actionContext)) return;
        }

        /// <summary>
        /// Ensure the content exists
        /// </summary>
        /// <param name="postedItem"></param>
        /// <param name="actionContext"></param>
        /// <param name="found"></param>
        /// <returns></returns>
        private bool ValidateExistingContent(ContentItemSave postedItem, HttpActionContext actionContext, out ContentItemDisplay found)
        {
            //TODO: We need to of course change this to the real umbraco api
            found = TestContentService.GetContentItem(postedItem.Id);
            if (found == null)
            {
                var message = string.Format("content with id: {0} was not found", postedItem.Id);
                actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.NotFound, message);
                return false;
            }
            return true;
        }

        /// <summary>
        /// Ensure all of the ids in the post are valid
        /// </summary>
        /// <param name="postedItem"></param>
        /// <param name="actionContext"></param>
        /// <param name="realItem"></param>
        /// <returns></returns>
        private bool ValidateProperties(ContentItemSave postedItem, ContentItemDisplay realItem, HttpActionContext actionContext)
        {
            foreach (var p in postedItem.Properties)
            {
                //ensure the property actually exists in our server side properties
                if (!realItem.Properties.Contains(p))
                {
                    //TODO: Do we return errors here ? If someone deletes a property whilst their editing then should we just
                    //save the property data that remains? Or inform them they need to reload... not sure. This problem exists currently too i think.

                    var message = string.Format("property with id: {0} was not found", p.Id);
                    actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.NotFound, message);
                    return false;
                }
            }
            return true;
        }

        //TODO: Validate that the property types exist

        //TODO: Validate the property type data

    }
}