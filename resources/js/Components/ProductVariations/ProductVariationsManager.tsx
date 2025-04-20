import {useState} from "react";
import VariationsList from "@/Components/ProductVariations/VariationsList";
import VariationForm from "@/Components/ProductVariations/VariationForm";

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

    const handleAddVariation = (variation: ProductVariation) => {
        const newVariation = {
            ...variation,
            product_id: productId || 0,
            // Generate a temporary ID if we're creating a new product
            id: productId ? undefined : Math.floor(Math.random() * -1000)
        };

        setVariations([...variations, newVariation]);
        setIsAddingVariation(false);
    };

    const handleUpdateVariation = (updatedVariation: ProductVariation) => {
        setVariations(variations.map(v =>
            v.id === updatedVariation.id ? updatedVariation : v
        ));
        setEditingVariation(null);
    };

    const handleDeleteVariation = (variationId: number) => {
        setVariations(variations.filter(v => v.id !== variationId));
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Product Variations</h3>
                <button
                    onClick={() => setIsAddingVariation(true)}
                    disabled={isAddingVariation || !!editingVariation}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                >
                    Add Variation
                </button>
            </div>

            {variations.length > 0 ? (
                <VariationsList
                    variations={variations}
                    onEdit={setEditingVariation}
                    onDelete={handleDeleteVariation}
                />
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
                    <VariationForm
                        variation={editingVariation || {
                            product_id: productId || 0,
                            sku: '',
                            price: 0,
                            stock: 0,
                            is_active: true,
                            options: [{ attribute_name: 'size', attribute_value: '' }]
                        }}
                        onSubmit={editingVariation ? handleUpdateVariation : handleAddVariation}
                        onCancel={() => {
                            setIsAddingVariation(false);
                            setEditingVariation(null);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductVariationsManager;
