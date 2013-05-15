using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace Umbraco.Belle.Models
{
    [DataContract(Name = "property", Namespace = "")]
    public class ContentProperty
    {
        [DataMember(Name = "id", IsRequired = true)]
        [Required]
        public int Id { get; set; }

        [DataMember(Name = "label", IsRequired = true)]
        [Required]
        public string Label { get; set; }

        [DataMember(Name = "alias", IsRequired = true)]
        [Required(AllowEmptyStrings = false)]
        public string Alias { get; set; }

        [DataMember(Name = "description")]
        public string Description { get; set; }

        [DataMember(Name = "value")]
        public string Value { get; set; }

        [DataMember(Name = "view", IsRequired = true)]
        [Required(AllowEmptyStrings = false)]
        public string View { get; set; }

        [DataMember(Name = "config")]
        public string Config { get; set; }

        protected bool Equals(ContentProperty other)
        {
            return Id == other.Id;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((ContentProperty) obj);
        }

        public override int GetHashCode()
        {
            return Id;
        }
    }
}