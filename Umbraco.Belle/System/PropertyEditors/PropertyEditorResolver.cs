using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core.ObjectResolution;

namespace Umbraco.Belle.System.PropertyEditors
{
    /// <summary>
    /// A resolver to resolve all property editors
    /// </summary>
    /// <remarks>
    /// This resolver will contain any property editors defined in manifests as well!
    /// </remarks>
    internal class PropertyEditorResolver : LazyManyObjectsResolverBase<PropertyEditorResolver, PropertyEditor>
    {
        public PropertyEditorResolver(Func<IEnumerable<Type>> typeListProducerList)
            : base(typeListProducerList, ObjectLifetimeScope.Application)
        {
        }

        /// <summary>
        /// Returns the property editors
        /// </summary>
        public IEnumerable<PropertyEditor> PropertyEditors
        {
            get { return Values.Union(ManifestBuilder.PropertyEditors); }
        }
    }
}