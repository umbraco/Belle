using Newtonsoft.Json;

namespace Umbraco.Belle.System.PropertyEditors
{
    internal class PreValueEditor
    {
        [JsonProperty("view")]
        public string View { get; set; }
    }
}