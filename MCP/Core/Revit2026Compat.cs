// Revit 2026 Compatibility Layer
// Provides backward compatibility for deprecated API methods

#if NET8_0_OR_GREATER
using Autodesk.Revit.DB;

namespace RevitMCP.Core
{
    /// <summary>
    /// Extension methods for Revit 2026 API compatibility.
    /// ElementId.IntegerValue was removed in Revit 2026 - use .Value instead.
    /// </summary>
    public static class Revit2026Compat
    {
        /// <summary>
        /// Provides IntegerValue compatibility for Revit 2026.
        /// In Revit 2026, ElementId.Value returns long instead of int.
        /// </summary>
        public static int IntegerValue(this ElementId elementId)
        {
            return (int)elementId.Value;
        }
    }
}
#endif
