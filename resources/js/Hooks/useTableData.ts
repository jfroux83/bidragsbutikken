import {useMemo} from "react";

export const useTableData = ({
    data,
    columns,
    filters,
    sort
}) => {

    return useMemo(() => {
        let processed = data.filter(row => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;

                const column = columns.find(col => col.key === key);
                const cellValue = column?.accessor ? column.accessor(row) : row[key];

                switch (column?.filterConfig?.type) {
                    case 'select':
                        return cellValue === value;
                    case 'boolean':
                        return cellValue === (value === 'true');
                    default:
                        return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
                }
            });
        });

        if (sort) {
            const { column, direction } = sort;
            processed = [...processed].sort((a, b) => {
                const columnDef = columns.find(col => col.key === column);
                const aValue = columnDef?.accessor ? columnDef.accessor(a) : a[column];
                const bValue = columnDef?.accessor ? columnDef.accessor(b) : b[column];

                if (direction === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
        }

        return processed;
    }, [data, filters, sort]);
}
