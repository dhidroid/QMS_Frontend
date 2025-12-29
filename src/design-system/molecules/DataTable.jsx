import React from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import Button from '../atoms/Button';

/**
 * DataTable Component
 * @param {Object} props
 * @param {Array<{key: string, label: string, render?: (row: any) => React.ReactNode, width?: string, align?: 'left'|'center'|'right'}>} props.columns
 * @param {Array<Object>} props.data
 * @param {string} props.keyField - Unique key for each row (e.g. 'TokenGuid' or 'id')
 * @param {Function} [props.onRowClick]
 * @param {Array<string>} [props.selectedIds]
 * @param {Function} [props.onSelectionChange]
 * @param {(row: any) => React.ReactNode} [props.rowActions] - Render function for row actions
 * @param {boolean} [props.loading]
 */
const DataTable = ({ 
  columns, 
  data, 
  keyField = 'id', 
  onRowClick, 
  selectedIds = [], 
  onSelectionChange,
  rowActions,
  loading
}) => {
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectionChange(data.map(d => d[keyField]));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (e, id) => {
    e.stopPropagation();
    if (e.target.checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(sid => sid !== id));
    }
  };

  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const isSelected = (id) => selectedIds.includes(id);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading data...</div>;
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-xs uppercase font-medium text-muted-foreground sticky top-0 z-10">
            <tr>
              {onSelectionChange && (
                <th className="px-4 py-3 w-[40px] text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    checked={allSelected}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={clsx(
                    "px-4 py-3 font-semibold tracking-wide whitespace-nowrap", 
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center'
                  )}
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
              {rowActions && <th className="px-4 py-3 w-[50px] text-center"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 bg-card">
            {data.length === 0 ? (
               <tr>
                 <td colSpan={columns.length + (onSelectionChange ? 1 : 0) + (rowActions ? 1 : 0)} className="px-4 py-8 text-center text-muted-foreground">
                   No records found
                 </td>
               </tr>
            ) : (
              data.map((row) => (
                <tr 
                  key={row[keyField]} 
                  onClick={() => onRowClick && onRowClick(row)}
                  className={clsx(
                    "group transition-colors hover:bg-muted/50 cursor-pointer",
                    isSelected(row[keyField]) && "bg-primary/5 hover:bg-primary/10"
                  )}
                >
                  {onSelectionChange && (
                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                        checked={isSelected(row[keyField])}
                        onChange={(e) => handleSelectRow(e, row[keyField])}
                      />
                    </td>
                  )}
                  
                  {columns.map((col) => (
                    <td 
                      key={col.key} 
                      className={clsx(
                        "px-4 py-3 font-medium text-foreground/90 whitespace-nowrap",
                        col.align === 'right' && 'text-right',
                        col.align === 'center' && 'text-center'
                      )}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  
                  {rowActions && (
                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        {rowActions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer / Pagination Placeholder */}
      <div className="border-t border-border px-4 py-3 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
        <div>
          Showing {data.length} results
        </div>
        <div className="flex gap-1" style={{ display: 'none' }}> {/* Hidden for now until pagination logic is added */}
          <Button variant="outline" size="sm" disabled><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" disabled><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
