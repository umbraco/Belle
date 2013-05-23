using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace Umbraco.Belle.System.Trees
{
    [CollectionDataContract(Name = "nodes", Namespace = "")]
    public class TreeNodeCollection : List<TreeNode>
    {        
    }
}