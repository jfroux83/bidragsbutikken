import React, {useState, useMemo, useEffect} from 'react';
import { BaseTable } from './BaseTable';
import {Action, BaseColumn, SortConfig} from "@/Components/DataTable/DataTable";
import {useTableData} from "@/Hooks/useTableData";

interface ClientDataTableProps<T = any> {
    columns: BaseColumn<T>[];
    data: T[];
    actions?: Action<T>[];
    pageSize?: number;
    onDataProcessed?: (data: T[]) => void;
}

export function ClientDataTable<T extends Record<string, any>>({
    columns,
    data,
    actions = [],
    pageSize = 10,
    onDataProcessed,
}: ClientDataTableProps<T>) {

    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [sort, setSort] = useState<SortConfig | null>(null);

    const processedData = useTableData({ data, columns, filters, sort});

    // Notify parent of processed data changes
    useEffect(() => {
        onDataProcessed?.(processedData);
    }, [processedData]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return processedData.slice(start, end);
    }, [processedData, currentPage, pageSize]);

    const handleSort = (column: string) => {
        setSort(prev => {
            if (!prev || prev.column !== column) {
                return { column, direction: 'asc' };
            }
            if (prev.direction === 'asc') {
                return { column, direction: 'desc' };
            }
            return null;
        });
    };

    const handleFilter = (key: string, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        setCurrentPage(1);
    };

    return (
        <BaseTable
            data={paginatedData}
            columns={columns}
            actions={actions}
            filters={filters}
            onFilter={handleFilter}
            sort={sort}
            onSort={handleSort}
            pagination={{
                currentPage,
                pageSize,
                totalItems: processedData.length,
                onPageChange: setCurrentPage
            }}
        />
    );
}
