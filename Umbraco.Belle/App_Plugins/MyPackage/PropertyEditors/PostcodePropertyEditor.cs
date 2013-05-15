using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Belle.System.PropertyEditors;

namespace Umbraco.Belle.App_Plugins.MyPackage.PropertyEditors
{
    [PropertyEditor("E96E24E5-7124-4FA8-A7D7-C3D3695E100D", "postcode", "Postal Code",
        "~/App_Plugins/MyPackage/PropertyEditors/Views/PostcodeEditor.html")]
    public class PostcodePropertyEditor : PropertyEditor
    {
    }
}