using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;
using Umbraco.Belle.Resources;

namespace Umbraco.Belle.System
{
 
    internal class ServerVariablesParser
    {

        /// <summary>
        /// Can allow developers to add custom variables on startup
        /// </summary>
        internal static EventHandler<Dictionary<string, object>> Parsing;

        internal const string Token = "##Variables##";

        internal static string Parse(Dictionary<string, object> items)
        {
            var vars = JsResources.ServerVariables;

            if (Parsing != null)
            {
                Parsing(null, items);
            }

            var json = JObject.FromObject(items);
            return vars.Replace(Token, json.ToString());            
        }
        
    }
}