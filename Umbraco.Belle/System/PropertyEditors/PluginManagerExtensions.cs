using System;
using System.Collections.Generic;
using Umbraco.Core;

namespace Umbraco.Belle.System.PropertyEditors
{
    internal static class PluginManagerExtensions
    {
        /// <summary>
        /// Returns all found property editors
        /// </summary>
        /// <param name="pluginManager"></param>
        /// <returns></returns>
        public static IEnumerable<Type> ResolvePropertyEditors(this PluginManager pluginManager)
        {
            return pluginManager.ResolveTypes<PropertyEditor>();
        } 
    }
}