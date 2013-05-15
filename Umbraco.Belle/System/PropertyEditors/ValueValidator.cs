using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Umbraco.Core;

namespace Umbraco.Belle.System.PropertyEditors
{
    /// <summary>
    /// A validator used to validate a value
    /// </summary>
    internal abstract class ValueValidator
    {
        protected ValueValidator()
        {
            var att = this.GetType().GetCustomAttribute<ValueValidatorAttribute>(false);
            if (att == null)
            {
                throw new InvalidOperationException("The class " + GetType() + " is not attributed with the " + typeof(ValueValidatorAttribute) + " attribute");
            }
            TypeName = att.TypeName;
        }

        public string TypeName { get; private set; }

        /// <summary>
        /// Performs the validation against the value
        /// </summary>
        /// <param name="value"></param>
        /// <param name="config">
        /// An object that is used to configure the validator. An example could be a regex 
        /// expression if the validator was a regex validator. 
        /// </param>
        /// <param name="editor">The property editor instance that is being validated</param>
        /// <returns></returns>
        public abstract IEnumerable<ValidationResult> Validate(object value, string config, PropertyEditor editor);
    }
}