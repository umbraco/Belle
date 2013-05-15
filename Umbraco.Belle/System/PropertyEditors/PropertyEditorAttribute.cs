using System;
using Umbraco.Core;

namespace Umbraco.Belle.System.PropertyEditors
{
    /// <summary>
    /// An attribute used to define all of the basic properties of a property editor
    /// on the server side.
    /// </summary>
    internal sealed class PropertyEditorAttribute : Attribute
    {
        public PropertyEditorAttribute(string id, string @alias, string name, string editorView)
        {
            Mandate.ParameterNotNullOrEmpty(id, "id");
            Mandate.ParameterNotNullOrEmpty(alias, "alias");
            Mandate.ParameterNotNullOrEmpty(name, "name");
            Mandate.ParameterNotNullOrEmpty(editorView, "editorView");

            Id = id;
            Alias = alias;
            Name = name;
            EditorView = editorView;

            //defaults
            ValueType = "string";
        }

        public PropertyEditorAttribute(string id, string @alias, string name)
        {
            Mandate.ParameterNotNullOrEmpty(id, "id");
            Mandate.ParameterNotNullOrEmpty(alias, "alias");
            Mandate.ParameterNotNullOrEmpty(name, "name");

            Id = id;
            Alias = alias;
            Name = name;

            //defaults
            ValueType = "string";
        }

        public PropertyEditorAttribute(string id, string alias, string name, string valueType, string editorView, string preValueEditorView)
        {
            Mandate.ParameterNotNullOrEmpty(id, "id");
            Mandate.ParameterNotNullOrEmpty(alias, "alias");
            Mandate.ParameterNotNullOrEmpty(name, "name");
            Mandate.ParameterNotNullOrEmpty(valueType, "valueType");
            Mandate.ParameterNotNullOrEmpty(editorView, "editorView");
            Mandate.ParameterNotNullOrEmpty(preValueEditorView, "preValueEditorView");

            Id = id;
            Alias = alias;
            Name = name;
            ValueType = valueType;
            EditorView = editorView;
            PreValueEditorView = preValueEditorView;
        }

        public string Id { get; private set; }
        public string Alias { get; private set; }
        public string Name { get; private set; }
        public string EditorView { get; private set; }
        public string ValueType { get; set; }
        public string PreValueEditorView { get; set; }
    }
}