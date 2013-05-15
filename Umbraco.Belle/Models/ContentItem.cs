using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Umbraco.Belle.Models
{
    [DataContract(Name = "content", Namespace = "")]
    public class ContentItem
    {
        public ContentItem()
        {
            //ensure its not null
            Properties = new List<ContentProperty>();
        }

        [DataMember(Name = "id")]
        public int Id { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "properties")]
        public IEnumerable<ContentProperty> Properties { get; set; }
    }
}