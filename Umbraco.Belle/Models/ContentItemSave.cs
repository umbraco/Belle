using System.Collections.Generic;
using Newtonsoft.Json;

namespace Umbraco.Belle.Models
{
    /// <summary>
    /// A model representing a content item to be saved
    /// </summary>
    public class ContentItemSave : ContentItemBase<ContentPropertyBase>
    {
        public ContentItemSave()
        {
            UploadedFiles = new List<ContentItemFile>();
        }

        /// <summary>
        /// The collection of files uploaded
        /// </summary>
        [JsonIgnore]
        public List<ContentItemFile> UploadedFiles { get; private set; }
    }

    /// <summary>
    /// Represents an uploaded file for a particular property
    /// </summary>
    public class ContentItemFile
    {
        /// <summary>
        /// The property id associated with the file
        /// </summary>
        public int PropertyId { get; set; }

        /// <summary>
        /// The file path for the uploaded file for where the MultipartFormDataStreamProvider has saved the temp file
        /// </summary>
        public string FilePath { get; set; }
    }
}