using System.Runtime.Serialization;

namespace Umbraco.Belle.Models
{
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