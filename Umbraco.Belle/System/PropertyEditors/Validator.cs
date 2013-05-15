using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Umbraco.Belle.System.PropertyEditors
{
    /// <summary>
    /// Represents a validator found in a package manifest
    /// </summary>
    internal class Validator
    {
        [JsonProperty("type", Required = Required.Always)]
        public string Type { get; set; }

        [JsonProperty("config")]
        public string Config { get; set; }

        private ValueValidator _validatorInstance;

        /// <summary>
        /// Gets the ValueValidator instance
        /// </summary>
        internal ValueValidator ValidatorInstance
        {
            get
            {
                if (_validatorInstance == null)
                {
                    var val = ValidatorsResolver.Current.GetValidator(Type);
                    if (val == null)
                    {
                        throw new InvalidOperationException("No " + typeof(ValueValidator) +  " could be found for the type name of " + Type);
                    }
                    _validatorInstance = val;
                }
                return _validatorInstance;
            }
        }

        /// <summary>
        /// Validates the object with the resolved ValueValidator found for this type
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public IEnumerable<ValidationResult> Validate(object value)
        {
            return ValidatorInstance.Validate(value, Config);
        }
    }
}