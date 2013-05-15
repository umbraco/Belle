using Newtonsoft.Json;

namespace Umbraco.Belle.System.PropertyEditors
{
    internal class Validator
    {
        [JsonProperty("type", Required = Required.Always)]
        public string Type { get; set; }

        [JsonProperty("value")]
        public string Value { get; set; }        
    }
}