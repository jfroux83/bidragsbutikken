import React from 'react';
import {CellRendererProps} from "@/Components/DataTable/DataTable";
import {formatDate} from "@/Lib/Utils";

export function CellRenderer<T>({ column, value, row }: CellRendererProps<T>) {
    const cellValue = column.accessor ? column.accessor(row) : value;

    if (column.formatter) {
        return column.formatter(cellValue, row);
    }

    switch (column.type) {
        case 'status':
            const statusValue = Boolean(cellValue).toString() as 'true' | 'false';
            const statusConfig = column.config?.status ?? {
                'true': { label: 'Active', className: 'text-green-600 bg-green-50' },
                'false': { label: 'Inactive', className: 'text-red-600 bg-red-50' }
            };
            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[statusValue].className}`}>
                    {statusConfig[statusValue].label}
                </span>
            );

        case 'boolean':
            return cellValue ? 'Yes' : 'No';

        case 'date':
            if (!cellValue) return '';
            const dateFormat = column.config?.date?.format ?? 'dd/MM/yyyy';
            return formatDate(new Date(cellValue), dateFormat);

        case 'badge':
            const colors = column.config?.badge?.colors ?? {};
            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[value] ?? 'bg-gray-100 text-gray-800'}`}>
                    {cellValue}
                </span>
            );

        default:
            return cellValue;
    }
}
