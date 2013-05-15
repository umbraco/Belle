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

    [CollectionDataContract(Name = "properties", Namespace = "")]
    public class ContentPropertyCollection : List<ContentProperty>
    {        
    }

    [DataContract(Name = "property", Namespace = "")]
    public class ContentProperty
    {
        [DataMember(Name = "id")]
        public int Id { get; set; }

        [DataMember(Name = "label")]
        public string Label { get; set; }

        [DataMember(Name = "alias")]
        public string Alias { get; set; }

        [DataMember(Name = "description")]
        public string Description { get; set; }

        [DataMember(Name = "value")]
        public string Value { get; set; }

        [DataMember(Name = "view")]
        public string View { get; set; }

        [DataMember(Name = "config")]
        public string Config { get; set; }
    }
}