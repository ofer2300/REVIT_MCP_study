using Autodesk.Revit.DB;

namespace RevitMCP.Core
{
    /// <summary>
    /// Helper class for ElementId operations with Revit 2026 compatibility.
    /// Revit 2026 removed ElementId.IntegerValue and uses ElementId.Value (long) instead.
    /// </summary>
    public static class ElementIdHelper
    {
        /// <summary>
        /// Gets the integer value of an ElementId.
        /// Compatible with both Revit 2025 (IntegerValue) and Revit 2026 (Value).
        /// </summary>
        public static int GetId(ElementId elementId)
        {
            if (elementId == null || elementId == ElementId.InvalidElementId)
                return -1;
                
#if REVIT_2026
            return (int)elementId.Value;
#else
            return elementId.IntegerValue;
#endif
        }

        /// <summary>
        /// Gets the long value of an ElementId (for Revit 2026+).
        /// </summary>
        public static long GetIdLong(ElementId elementId)
        {
            if (elementId == null || elementId == ElementId.InvalidElementId)
                return -1;
                
#if REVIT_2026
            return elementId.Value;
#else
            return elementId.IntegerValue;
#endif
        }

        /// <summary>
        /// Creates an ElementId from an integer.
        /// Compatible with both Revit 2025 and Revit 2026.
        /// </summary>
        public static ElementId FromInt(int id)
        {
#if REVIT_2026
            return new ElementId((long)id);
#else
            return new ElementId(id);
#endif
        }

        /// <summary>
        /// Creates an ElementId from a long.
        /// Compatible with both Revit 2025 and Revit 2026.
        /// </summary>
        public static ElementId FromLong(long id)
        {
#if REVIT_2026
            return new ElementId(id);
#else
            return new ElementId((int)id);
#endif
        }
    }
}
