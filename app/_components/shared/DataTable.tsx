'use client';

import { ReactNode } from 'react';
import { cn } from '@/app/_lib/utils';

interface Column {
  key: string;
  title: string;
  width?: string;
  render?: (value: any, row: any) => ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  className?: string;
  emptyMessage?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  width?: string;
}

export function TableRow({ children, className, onClick }: TableRowProps) {
  return (
    <tr 
      className={cn(
        "border-b border-slate-700 transition-colors hover:bg-slate-800/50",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className, width }: TableCellProps) {
  return (
    <td 
      className={cn("px-4 py-3 text-sm text-slate-300", className)}
      style={{ width }}
    >
      {children}
    </td>
  );
}

export function TableHeaderCell({ children, className, width }: TableCellProps) {
  return (
    <th 
      className={cn("px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider", className)}
      style={{ width }}
    >
      {children}
    </th>
  );
}

export default function DataTable({
  columns,
  data,
  loading = false,
  className,
  emptyMessage = "데이터가 없습니다"
}: DataTableProps) {
  if (loading) {
    return (
      <div className={cn("rounded-xl border border-slate-700 bg-slate-800/50 overflow-hidden", className)}>
        <div className="animate-pulse">
          <div className="h-12 bg-slate-700/50 border-b border-slate-600"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-800/30 border-b border-slate-700/50 last:border-b-0"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-slate-700 bg-slate-800/50 overflow-hidden", className)}>
      <table className="w-full">
        <thead className="bg-slate-900/50 border-b border-slate-700">
          <tr>
            {columns.map((column) => (
              <TableHeaderCell 
                key={column.key} 
                width={column.width}
              >
                {column.title}
              </TableHeaderCell>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length}
                className="px-4 py-12 text-center text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <TableRow key={row.id || index}>
                {columns.map((column) => (
                  <TableCell key={column.key} width={column.width}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}