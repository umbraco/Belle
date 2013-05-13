using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core;

namespace Umbraco.Belle.System
{
    //TODO: This stuff needs to be a part of the application cache in the core, but for now we're just
    //gonna chuck it here.
    internal static class ApplicationCacheExtensions
    {

        private static readonly ConcurrentDictionary<string, object> StaticCache = new ConcurrentDictionary<string, object>(); 

        public static T GetStaticCacheItem<T>(this CacheHelper cache, string key, Func<T> getItem)
        {
            return (T) StaticCache.GetOrAdd(key, s => getItem());
        }

        public static void ClearStaticCacheItem(this CacheHelper cache, string key)
        {
            object val;
            StaticCache.TryRemove(key, out val);
        }

    }
}