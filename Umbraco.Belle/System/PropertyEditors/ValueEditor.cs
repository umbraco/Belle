using System.Collections.Generic;
using Newtonsoft.Json;

namespace Umbraco.Belle.System.PropertyEditors
{
    internal class ValueEditor
    {
        [JsonProperty("view", Required = Required.Always)]
        public string View { get; set; }

        [JsonProperty("valueType")]
        public string ValueType { get; set; }

        [JsonProperty("validation")]
        public IEnumerable<Validator> Validators { get; set; }
    }
}