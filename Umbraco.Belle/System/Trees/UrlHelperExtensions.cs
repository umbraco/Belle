using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Formatting;
using System.Web;
using System.Web.Http.Routing;
using Umbraco.Core;
using Umbraco.Web;

namespace Umbraco.Belle.System.Trees
{
    public static class UrlHelperExtensions
    {
        public static string GetTreeUrl(this UrlHelper urlHelper, Type treeType, string nodeId, FormDataCollection queryStrings)
        {
            var actionUrl = urlHelper.GetUmbracoApiService("GetNodes", treeType)
                .EnsureEndsWith('?');
            
            //now we need to append the query strings
            actionUrl += "id=" + nodeId.EnsureEndsWith('&') + queryStrings.ToQueryString("id");
            return actionUrl;
        }

    }
}