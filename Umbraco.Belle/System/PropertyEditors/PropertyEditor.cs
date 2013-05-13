using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Umbraco.Belle.System.PropertyEditors
{
    internal class PropertyEditor
    {

        public string Alias { get; set; }
        public string Name { get; set; }
        public ValueEditor ValueEditor { get; set; }
        PreValueEditor PreValueEditor { get; set; }

    }

    internal class ValueEditor
    {
        public string View { get; set; }
    }

    internal class PreValueEditor
    {
        public string View { get; set; }
    }
}