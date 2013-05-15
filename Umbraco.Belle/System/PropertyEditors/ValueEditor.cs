using System.Collections.Generic;
using Newtonsoft.Json;

namespace Umbraco.Belle.System.PropertyEditors
{
    internal class ValueEditor
    {
        /// <summary>
        /// assign defaults
        /// </summary>
        public ValueEditor()
        {
            ValueType = "string";
        }

        /// <summary>
        /// The full virtual path or the relative path to the current Umbraco folder for the angular view
        /// </summary>
        [JsonProperty("view", Required = Required.Always)]
        public string View { get; set; }

        /// <summary>
        /// The value type which reflects how it is validated and stored in the database
        /// </summary>
        [JsonProperty("valueType")]
        public string ValueType { get; set; }

        /// <summary>
        /// A collection of validators for the pre value editor
        /// </summary>
        [JsonProperty("validation")]
        public IEnumerable<Validator> Validators { get; set; }

    }
}