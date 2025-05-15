export interface Variation {
    id: number;
    sku: string;
    price: number;
    status: boolean;
}

export interface Product {
    id: number;
    name: string;
    tag_line: string;
    unit_measure: string;
    variations?: Variation[];
}
