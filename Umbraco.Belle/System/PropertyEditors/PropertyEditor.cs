using System;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace Umbraco.Belle.System.PropertyEditors
{
    internal class PropertyEditor
    {
        /// <summary>
        /// The id  of the property editor
        /// </summary>
        [JsonProperty("id", Required = Required.Always)]
        public Guid Id { get; set; }

        /// <summary>
        /// The alias of the property editor
        /// </summary>
        [JsonProperty("alias", Required = Required.Always)]
        public string Alias { get; set; }

        /// <summary>
        /// The name of the property editor
        /// </summary>
        [JsonProperty("name", Required = Required.Always)]
        public string Name { get; set; }

        [JsonProperty("editor", Required = Required.Always)]
        public ValueEditor ValueEditor { get; set; }

        [JsonProperty("preValueEditor")]
        PreValueEditor PreValueEditor { get; set; }

    }
}