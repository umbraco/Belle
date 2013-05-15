using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core.ObjectResolution;

namespace Umbraco.Belle.System.PropertyEditors
{
    /// <summary>
    /// A resolver to resolve all property editor server side plugins
    /// </summary>
    /// <remarks>
    /// This resolver will not contain any property editors defined in manifests! Only property editors defined server side.
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
            get { return Values; }
        }
    }
}