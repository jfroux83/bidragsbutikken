import React from "react";
import { LucideIcon } from 'lucide-react';

export type FilterType = 'text' | 'select' | 'boolean' | 'date';

export interface SortConfig {
    column: string;
    direction: 'asc' | 'desc' | null;
}

export interface FilterConfig {
    type: FilterType;
    placeholder?: string;
    options?: Array<{ label: string; value: any }>;  // For select type
}

export interface StatusConfig {
    'true': { label: string; className: string };
    'false': { label: string; className: string };
}

export interface DateConfig {
    format?: string;
}

export interface BadgeConfig {
    colors: Record<string, string>;
}

export interface BaseColumn<T = any> {
    key: string;
    title: string;
    width?: string;
    filterable?: boolean;
    filterConfig?: FilterConfig;
    accessor?: (row: T) => any;
    formatter?: (value: any, row: T) => React.ReactNode;
    type?: 'text' | 'status' | 'boolean' | 'date' | 'badge';
    config?: {
        status?: StatusConfig;
        date?: DateConfig;
        badge?: BadgeConfig;
    };
    sortable?: boolean;
}

export interface Action<T = any> {
    icon: LucideIcon;
    label: string;
    onClick: (row: T) => void;
    variant?: 'primary' | 'secondary' | 'danger';
}

export interface PaginationProps {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

export interface BaseTableProps<T = any> {
    data: T[];
    columns: BaseColumn<T>[];
    actions?: Action<T>[];
    filters: Record<string, any>;
    onFilter: (key: string, value: any) => void;
    pagination: PaginationProps;
    sort: SortConfig | null;
    onSort: (column: string) => void
}

export interface CellRendererProps<T = any> {
    column: BaseColumn<T>;
    value: any;
    row: T;
}

export interface ServerTableState {
    sort?: SortConfig;
    filters: Record<string, any>;
    page: number;
    perPage: number;
}
