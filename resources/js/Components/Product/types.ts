export interface VariationOption {
    attribute_name: string;
    attribute_value: string;
}

export interface Variation {
    // Using a temporary client-side ID for list keys during add/edit
    // Real ID comes from DB for existing variations.
    id?: number | string; // number for existing, string (e.g., uuid) for new ones before save
    sku: string;
    price: number | string; // Use string initially for input fields, convert later
    stock: number | string; // Use string initially for input fields, convert later
    is_active: boolean;
    options: VariationOption[];
    // Flag to mark for deletion on the backend if needed during updates
    _delete?: boolean;
}

export interface ProductVariationsManagerProps {
    initialVariations?: Variation[]; // Existing variations for editing
    onChange: (variations: Variation[]) => void; // Callback to update parent state
    attributeNames: string[]; // Defines which attributes to manage (e.g., ['Size'], ['Size', 'Color'])
    basePrice?: number | string; // Optional: Can be used for context or defaults
    errors?: Record<string, any>; // Optional: Pass down validation errors specific to variations
    disabled?: boolean; // Optional: Disable the whole component
}
