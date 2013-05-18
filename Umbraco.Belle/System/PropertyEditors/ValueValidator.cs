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
        /// <returns>
        /// Returns a list of validation results. If a result does not have a field name applied to it then then we assume that 
        /// the validation message applies to the entire property type being validated. If there is a field name applied to a 
        /// validation result we will try to match that field name up with a field name on the item itself.
        /// </returns>
        public abstract IEnumerable<ValidationResult> Validate(object value, string config, PropertyEditor editor);
    }
}