using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using Umbraco.Core.Models;

namespace Umbraco.Belle.Models
{
    /// <summary>
    /// Represents a content property that is displayed in the UI
    /// </summary>
    public class ContentPropertyDisplay : ContentPropertyBase
    {
        [DataMember(Name = "label", IsRequired = true)]
        [Required]
        public string Label { get; set; }

        [DataMember(Name = "alias", IsRequired = true)]
        [Required(AllowEmptyStrings = false)]
        public string Alias { get; set; }

        [DataMember(Name = "description")]
        public string Description { get; set; }

        [DataMember(Name = "view", IsRequired = true)]
        [Required(AllowEmptyStrings = false)]
        public string View { get; set; }

        [DataMember(Name = "config")]
        public string Config { get; set; }
    }

    /// <summary>
    /// Represents a content property from the database
    /// </summary>
    internal class ContentPropertyDto : ContentPropertyBase
    {
        public IDataTypeDefinition DataType { get; set; }
        public string Label { get; set; }
        public string Alias { get; set; }
        public string Description { get; set; }

        public ContentPropertyDisplay ForDisplay(string getPreValue, string view)
        {
            return new ContentPropertyDisplay
                {
                    Alias = Alias,
                    Id = Id,
                    View = view,
                    Config = getPreValue,
                    Description = Description,
                    Label = Label,
                    Value = Value
                };
        }
    }
    
}