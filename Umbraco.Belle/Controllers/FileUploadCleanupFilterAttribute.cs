using System.IO;
using System.Linq;
using System.Web.Http.Filters;
using Umbraco.Belle.Models;

namespace Umbraco.Belle.Controllers
{
    /// <summary>
    /// Checks if the parameter is ContentItemSave and then deletes any temporary saved files from file uploads associated with the request
    /// </summary>
    internal class FileUploadCleanupFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            base.OnActionExecuted(actionExecutedContext);

            if (actionExecutedContext.ActionContext.ActionArguments.Any())
            {
                var contentItem = actionExecutedContext.ActionContext.ActionArguments.First().Value as ContentItemSave;   
                if (contentItem != null)
                {
                    //cleanup any files associated
                    foreach (var f in contentItem.UploadedFiles)
                    {
                        File.Delete(f.FilePath);
                    }
                }
            }
        }
    }
}