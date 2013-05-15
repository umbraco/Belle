using System;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Umbraco.Core;

namespace Umbraco.Belle.System.PropertyEditors
{
    public class PropertyEditor
    {
        /// <summary>
        /// The constructor will setup the property editor based on the attribute if one is found
        /// </summary>
        internal PropertyEditor()
        {
            //build defaults
            PreValueEditor = new PreValueEditor();
            ValueEditor = new ValueEditor();

            //assign properties based on the attribute if it is found
            var att = GetType().GetCustomAttribute<PropertyEditorAttribute>(false);
            if (att != null)
            {
                Id = Guid.Parse(att.Id);
                Alias = att.Alias;
                Name = att.Name;
                ValueEditor.ValueType = att.ValueType;
                ValueEditor.View = att.EditorView;
                PreValueEditor.View = att.PreValueEditorView;
            }
        }

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

        /// <summary>
        /// Will be equal if either the alias OR the id are equal!
        /// </summary>
        /// <param name="other"></param>
        /// <returns></returns>
        protected bool Equals(PropertyEditor other)
        {
            return string.Equals(Alias, other.Alias) || Id.Equals(other.Id);
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            var other = obj as PropertyEditor;
            return other != null && Equals(other);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return (Alias.GetHashCode()*397) ^ Id.GetHashCode();
            }
        }
    }
}