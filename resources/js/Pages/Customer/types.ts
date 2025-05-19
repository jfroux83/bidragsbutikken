export interface Variation {
    id: number;
    sku: string;
    price: number;
    status: boolean;
}

export type ProductType = 'both' | 'subscription' | 'once-off';

export interface Product {
    id: number;
    name: string;
    tag_line: string;
    unit_measure: string;
    base_price: number;
    type: ProductType;
    variations?: Variation[];
    categories?: number[];
    tags?: number[];
}

export interface FilterOption {
    label: string;
    value: number;
}
