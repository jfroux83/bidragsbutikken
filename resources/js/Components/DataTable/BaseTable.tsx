import { X } from 'lucide-react';
import { CellRenderer } from './CellRenderer';
import {BaseColumn, BaseTableProps} from "@/Components/DataTable/DataTable";
import Pagination from "@/Components/DataTable/Pagination";

export function BaseTable<T extends Record<string, any>>({
    data,
    columns,
    actions = [],
    filters,
    onFilter,
    pagination,
    sort,
    onSort,
}: BaseTableProps<T>) {
    const renderFilterInput = (column: BaseColumn<T>) => {
        if (!column.filterable) return null;

        switch (column.filterConfig?.type) {
            case 'select':
                return (
                    <select
                        className="mt-2 px-3 py-2 block w-full rounded-md border border-gray-300 text-sm"
                        value={filters[column.key] || ''}
                        onChange={(e) => onFilter(column.key, e.target.value)}
                    >
                        <option value="">All</option>
                        {column.filterConfig.options?.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'boolean':
                return (
                    <select
                        className="mt-2 px-3 py-2 block w-full rounded-md border border-gray-300 text-sm"
                        value={filters[column.key] || ''}
                        onChange={(e) => onFilter(column.key, e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                );

            default:
                return (
                    <div className="mt-2 relative">
                        <input
                            type="text"
                            className="px-3 py-2 block w-full rounded-md border border-gray-300 pr-8 text-sm"
                            placeholder={column.filterConfig?.placeholder || `Filter ${column.title}`}
                            value={filters[column.key] || ''}
                            onChange={(e) => onFilter(column.key, e.target.value)}
                        />
                        {filters[column.key] && (
                            <button
                                onClick={() => onFilter(column.key, '')}
                                className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="relative overflow-hidden rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                    <tr className="divide-x divide-gray-200">
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className="bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                style={column.width ? { width: column.width } : undefined}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {column.title}
                                        {column.sortable && (
                                            <button
                                                onClick={() => onSort(column.key)}
                                                className="ml-2 p-1 hover:bg-gray-100 rounded"
                                            >
                                                {sort?.column === column.key ? (
                                                    sort.direction === 'asc' ? '↑' : '↓'
                                                ) : '↕'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {renderFilterInput(column)}
                            </th>
                        ))}
                        {actions.length > 0 && (
                            <th className="bg-gray-50 px-3 py-3.5 text-sm font-semibold text-gray-900 w-[100px]">
                                Actions
                            </th>
                        )}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="divide-x divide-gray-200 hover:bg-gray-50">
                            {columns.map((column) => (
                                <td
                                    key={column.key}
                                    className="px-3 py-3.5 text-sm text-gray-500"
                                >
                                    <CellRenderer
                                        column={column}
                                        value={row[column.key]}
                                        row={row}
                                    />
                                </td>
                            ))}
                            {actions.length > 0 && (
                                <td className="px-3 py-3.5 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        {actions.map((action, actionIndex) => {
                                            const Icon = action.icon;
                                            return (
                                                <button
                                                    key={actionIndex}
                                                    onClick={() => action.onClick(row)}
                                                    className={`p-1 rounded-full hover:bg-gray-100
                                                            ${action.variant === 'danger' ? 'text-red-600 hover:text-red-700' :
                                                        action.variant === 'primary' ? 'text-blue-600 hover:text-blue-700' :
                                                            'text-gray-600 hover:text-gray-700'}`}
                                                    title={action.label}
                                                >
                                                    <Icon className="h-4 w-4"/>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Pagination {...pagination} />
        </div>
    );
}
