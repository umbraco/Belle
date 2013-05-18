using System;
using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Umbraco.Belle.Models
{
    /// <summary>
    /// A model representing a content item to be displayed in the back office
    /// </summary>    
    public class ContentItemDisplay : ContentItemBase<ContentPropertyDisplay>
    {        
        [DataMember(Name = "name", IsRequired = true)]
        [Required(AllowEmptyStrings = false)]
        public string Name { get; set; }
    }
}