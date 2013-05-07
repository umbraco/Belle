using System.Collections.Generic;

namespace Umbraco.Belle.System.Trees
{
    public interface ISearchableTree
    {
        IEnumerable<SearchResultItem> Search(string searchText);
    }
}