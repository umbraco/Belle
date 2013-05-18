using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Umbraco.Belle.System.PropertyEditors;

namespace Umbraco.Belle.System.Serialization
{

    /// <summary>
    /// Used to convert a property editor manifest to a property editor object
    /// </summary>
    internal class PropertyEditorConverter : JsonCreationConverter<PropertyEditor>
    {
        protected override PropertyEditor Create(Type objectType, JObject jObject)
        {
            return new PropertyEditor();
        }

        protected override void Deserialize(JObject jObject, PropertyEditor target, JsonSerializer serializer)
        {
            if (jObject["editor"] != null)
            {
                //we need to specify the view value for the editor here otherwise we'll get an exception
                target.StaticallyDefinedValueEditor.View = jObject["editor"]["view"].ToString();
                target.StaticallyDefinedValueEditor.Validators = new List<Validator>();
            }

            base.Deserialize(jObject, target, serializer);
        }
    }
}