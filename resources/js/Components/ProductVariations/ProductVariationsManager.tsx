import {useState} from "react";

interface ProductVariation {
    id?: number;
    product_id: number;
    sku: string;
    price: number;
    stock: number;
    is_active: boolean;
    options: {
        attribute_name: string;
        attribute_value: string;
    }[];
}

interface Props {
    productId?: number;
    initialVariations?: ProductVariation[];
    onChange: (variations: ProductVariation[]) => void;
}

const ProductVariationsManager = ({
    productId,
    initialVariations = [],
    onChange
}: Props) => {

    const [variations, setVariations] = useState<ProductVariation[]>(initialVariations);
    const [isAddingVariation, setIsAddingVariation] = useState(false);
    const [editingVariation, setEditingVariation] = useState<ProductVariation | null>(null);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Product Variations</h3>
                {/* TODO: Button Component */}
            </div>

            {variations.length > 0 ? (
                // TODO: VariationsList
                <div></div>
            ) : (
                <div className="text-center py-8 bg-gray-50 rounded-md">
                    <p className="text-gray-500">No variations added yet.</p>
                    <p className="text-sm text-gray-400">Click "Add Variation" to create product variations</p>
                </div>
            )}

            {(isAddingVariation || editingVariation) && (
                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                    <h4 className="font-medium mb-3">
                        {editingVariation ? 'Edit Variation' : 'Add New Variation'}
                    </h4>
                    {/* TODO: VariationForm */}
                </div>
            )}
        </div>
    );
};

export default ProductVariationsManager;
