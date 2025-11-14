import { LayoutGrid, List } from 'lucide-react';
import { useUIStore } from '@/store';
import './ViewToggle.css';

/**
 * ViewToggle Component
 *
 * Toggle button to switch between grid and list view modes.
 * Shows icon for current view with tooltip.
 */
export const ViewToggle = () => {
  const { viewMode, toggleViewMode } = useUIStore();

  const isGridView = viewMode === 'grid';
  const Icon = isGridView ? List : LayoutGrid;
  const tooltipText = isGridView ? 'Switch to List View' : 'Switch to Grid View';

  return (
    <button
      className="view-toggle"
      onClick={toggleViewMode}
      title={tooltipText}
      aria-label={tooltipText}
    >
      <Icon size={20} />
    </button>
  );
};

export default ViewToggle;
