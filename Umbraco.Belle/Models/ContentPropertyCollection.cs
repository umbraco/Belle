using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Umbraco.Belle.Models
{
    [CollectionDataContract(Name = "properties", Namespace = "")]
    public class ContentPropertyCollection : List<ContentProperty>
    {        
    }
}