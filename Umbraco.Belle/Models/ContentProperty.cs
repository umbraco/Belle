using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace Umbraco.Belle.Models
{
    /// <summary>
    /// Represents a content property to be saved
    /// </summary>
    [DataContract(Name = "property", Namespace = "")]
    public class ContentProperty
    {
        [DataMember(Name = "id", IsRequired = true)]
        [Required]
        public int Id { get; set; }

        [DataMember(Name = "value")]
        public string Value { get; set; }

        protected bool Equals(ContentPropertyDisplay other)
        {
            return Id == other.Id;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((ContentPropertyDisplay)obj);
        }

        public override int GetHashCode()
        {
            return Id;
        }
    }
}