using System;
using System.Collections.Generic;
using System.Linq;
using System.Management.Instrumentation;
using System.Net.Http.Formatting;
using System.Web;
using System.Web.Mvc;
using Umbraco.Belle.System.Trees;
using Umbraco.Core;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;
using umbraco.BusinessLogic;
using umbraco.cms.presentation.Trees;

namespace Umbraco.Belle.Controllers
{

    //NOTE: We will of course have to authorized this but changing the base class once integrated

    [PluginController("UmbracoTrees")]
    public class ApplicationTreeApiController : UmbracoApiController //UmbracoAuthorizedApiController
    {

        public ApplicationTreeApiController()
        {
            
        }

        [HttpQueryStringFilterAttribute("queryStrings")]
        public TreeNodeCollection GetTreeData(string treeType, string id, FormDataCollection queryStrings)
        {
            if (treeType == null) throw new ArgumentNullException("treeType");
            
            var configTrees = ApplicationTree.getAll();
            
            //get the configured tree
            var foundConfigTree = configTrees.FirstOrDefault(x => x.Alias.InvariantEquals(treeType));
            if (foundConfigTree == null) 
                throw new InstanceNotFoundException("Could not find tree of type " + treeType + " in the trees.config");

            var byControllerAttempt = TryLoadFromControllerTree(foundConfigTree, id, queryStrings);
            if (byControllerAttempt.Success)
            {
                return byControllerAttempt.Result;
            }
            var legacyAttempt = TryLoadFromLegacyTree(foundConfigTree, id, queryStrings);
            if (legacyAttempt.Success)
            {
                return legacyAttempt.Result;
            }

            throw new ApplicationException("Could not render a tree for type " + treeType);
        }

        private Attempt<TreeNodeCollection> TryLoadFromControllerTree(ApplicationTree appTree, string id, FormDataCollection formCollection)
        {
            //get reference to all TreeApiControllers
            var controllerTrees = UmbracoApiControllerResolver.Current.RegisteredUmbracoApiControllers
                                                              .Where(TypeHelper.IsTypeAssignableFrom<TreeApiController>)
                                                              .ToArray();

            //find the one we're looking for
            var foundControllerTree = controllerTrees.FirstOrDefault(x => x.GetFullNameWithAssembly() == appTree.Type);
            if (foundControllerTree == null)
            {
                return new Attempt<TreeNodeCollection>(new InstanceNotFoundException("Could not find tree of type " + appTree.Type + " in any loaded DLLs"));
            }

            //instantiate it, since we are proxying, we need to setup the instance with our current context
            var instance = (TreeApiController)DependencyResolver.Current.GetService(foundControllerTree);
            instance.ControllerContext = ControllerContext;
            instance.Request = Request;

            //return it's data
            return new Attempt<TreeNodeCollection>(true, instance.GetNodes(id, formCollection));
        }

        private Attempt<TreeNodeCollection> TryLoadFromLegacyTree(ApplicationTree appTree, string id, FormDataCollection formCollection)
        {
            //This is how the legacy trees worked....
            var treeDef = TreeDefinitionCollection.Instance.FindTree(appTree.Alias);
            if (treeDef == null)
            {
                return new Attempt<TreeNodeCollection>(new InstanceNotFoundException("Could not find tree of type " + appTree.Alias));
            }

            var bTree = treeDef.CreateInstance();
            var treeParams = new TreeParams();

            //we currently only support an integer id or a string id, we'll refactor how this works
            //later but we'll get this working first
            int startId;
            if (int.TryParse(id, out startId))
            {
                treeParams.StartNodeID = startId;
            }
            else
            {
                treeParams.NodeKey = id;
            }
            var xTree = new XmlTree();
            bTree.SetTreeParameters(treeParams);
            bTree.Render(ref xTree);

            return new Attempt<TreeNodeCollection>(true, LegacyTreeDataAdapter.ConvertFromLegacy(xTree));
        }

        //Temporary, but necessary until we refactor trees in general
        internal class TreeParams : ITreeService
        {
            public string NodeKey { get; set; }
            public int StartNodeID { get; set; }
            public bool ShowContextMenu { get; set; }
            public bool IsDialog { get; set; }
            public TreeDialogModes DialogMode { get; set; }
            public string FunctionToCall { get; set; }
        }

    }
}
