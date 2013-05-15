using System;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace Umbraco.Belle.System.PropertyEditors
{
    internal class PropertyEditor
    {
        [JsonProperty("id", Required = Required.Always)]
        public Guid Id { get; set; }

        [JsonProperty("alias", Required = Required.Always)]
        public string Alias { get; set; }

        [JsonProperty("name", Required = Required.Always)]
        public string Name { get; set; }

        [JsonProperty("editor", Required = Required.Always)]
        public ValueEditor ValueEditor { get; set; }

        [JsonProperty("preValueEditor")]
        PreValueEditor PreValueEditor { get; set; }

    }
}