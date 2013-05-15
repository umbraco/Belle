using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Umbraco.Core;

namespace Umbraco.Belle.System.PropertyEditors
{
    /// <summary>
    /// A validator that validates a delimited set of values against a common regex
    /// </summary>
    [ValueValidator("MultiValue")]
    internal sealed class MultiValueValidator : ValueValidator
    {
        /// <summary>
        /// Performs the validation
        /// </summary>
        /// <param name="value"></param>
        /// <param name="config">Can be a json formatted string containing properties: 'delimiter' and 'pattern'</param>
        /// <param name="editor"></param>
        /// <returns></returns>
        public override IEnumerable<ValidationResult> Validate(object value, string config, PropertyEditor editor)
        {
            //TODO: localize these!

            if (!(value is string))
            {
                throw new InvalidOperationException("The value parameter must be a string for this validator type");
            }

            var delimiter = ",";
            Regex regex = null;
            if (!config.IsNullOrWhiteSpace())
            {
                var json = JsonConvert.DeserializeObject<JObject>(config);
                if (json["delimiter"] != null)
                {
                    delimiter = json["delimiter"].ToString();
                }
                if (json["pattern"] != null)
                {
                    var regexPattern = json["pattern"].ToString();
                    regex = new Regex(regexPattern);
                }
            }

            var valueTypeValidator = new ValueTypeValueValidator();
            var stringVal = (string) value;
            var split = stringVal.Split(new[] {delimiter}, StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < split.Length; i++)
            {
                var s = split[i];
                //validate each item, first start with the value type
                foreach (var v in valueTypeValidator.Validate(s, "", editor))
                {
                    yield return v;
                }
                //next if we have a regex statement validate with that
                if (regex != null)
                {
                    if (!regex.IsMatch(s))
                    {
                        yield return new ValidationResult("The item at index " + i + " did not match the expression " + regex);
                    }
                }
            }
        }
    }
}