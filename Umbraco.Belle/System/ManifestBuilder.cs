using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using Umbraco.Core;
using Umbraco.Core.IO;

namespace Umbraco.Belle.System
{
    /// <summary>
    /// This reads in the manifests and stores some definitions in memory so we can look them on the server side
    /// </summary>
    internal class ManifestBuilder : ApplicationEventHandler
    {

        //TODO: We will remove these when we move to Umbraco core.
        protected override bool ExecuteWhenApplicationNotConfigured
        {
            get { return true; }
        }
        protected override bool ExecuteWhenDatabaseNotConfigured
        {
            get { return true; }
        }

        /// <summary>
        /// Read in the manifests and store the data
        /// </summary>
        /// <param name="umbracoApplication"></param>
        /// <param name="applicationContext"></param>
        protected override void ApplicationStarted(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
        {
            base.ApplicationStarted(umbracoApplication, applicationContext);

            var parser = new ManifestParser(new DirectoryInfo(IOHelper.MapPath("~/App_Plugins")));
            var manifests = parser.GetManifests();

            //ensures that we statically cache all property editors that are resolved
            var cachedEditors = applicationContext.ApplicationCache.GetStaticCacheItem(
                typeof (ManifestBuilder).FullName.EnsureEndsWith('.') + "PropertyEditors",
                () => manifests.SelectMany(x => x.PropertyEditors).ToArray());            
        }

    }
}