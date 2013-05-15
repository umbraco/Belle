using System;

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
            Id = id;
            Alias = alias;
            Name = name;
            EditorView = editorView;
        }

        public PropertyEditorAttribute(string id, string @alias, string name, string valueType, string editorView, string preValueEditorView)
        {
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
        public string ValueType { get; set; }
        public string EditorView { get; private set; }
        public string PreValueEditorView { get; set; }
    }
}