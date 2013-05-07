using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace Umbraco.Belle.System.Trees
{
    [CollectionDataContract(Name = "nodes", Namespace = "")]
    public class TreeNodeCollection : IEnumerable<TreeNode>
    {
        private readonly List<TreeNode> _innerList = new List<TreeNode>();

        public TreeNode this[int index]
        {
            get { return _innerList[index]; }
        }
        
        public void Add(TreeNode node)
        {
            _innerList.Add(node);
        }

        public void Remove(TreeNode node)
        {
            _innerList.Remove(node);
        }

        public void Insert(int index, TreeNode node)
        {
            _innerList.Insert(index, node);
        }

        public IEnumerator<TreeNode> GetEnumerator()
        {
            return _innerList.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return _innerList.GetEnumerator();
        }

        public IEnumerable<TreeNode> Nodes
        {
            get { return _innerList; }
        } 
    }
}