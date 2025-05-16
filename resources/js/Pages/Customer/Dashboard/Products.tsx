import {useState} from "react";
import {Product} from "@/Pages/Customer/types";
import Card from "@/Components/Card/Card";
import CardHeader from "@/Components/Card/CardHeader";
import CardTitle from "@/Components/Card/CardTitle";
import CardContent from "@/Components/Card/CardContent";
import {Box, DollarSign, Tag} from "lucide-react";

interface Props {
    products: Product[];
}

const Products = ({ products }: Props) => {

    const [selectedVariations, setSelectedVariations] = useState<Record<number, number>>({});

    const handleVariationChange = (productId: number, variationId: number) => {
        setSelectedVariations(prev => ({
            ...prev,
            [productId]: variationId
        }));
    };

    const getSelectedVariation = (product: Product) => {
        if (!product.variations || product.variations.length === 0) return null;

        const selectedId = selectedVariations[product.id];
        return selectedId ? product.variations.find(v => v.id === selectedId) : null;
    };

    return (
        <>
            {products.map((product) => {
                const selectedVariation = getSelectedVariation(product);

                return (
                    <Card key={product.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle>{product.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-gray-500" />
                                    <span>{product.tag_line}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Box className="w-4 h-4 text-gray-500" />
                                    <span>{product.unit_measure}</span>
                                </div>

                                {product.variations && product.variations.length > 0 && (
                                    <div className="mt-4">
                                        <label htmlFor={`variation-${product.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                            Select Variation
                                        </label>
                                        <select
                                            id={`variation-${product.id}`}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                                            onChange={(e) => handleVariationChange(product.id, Number(e.target.value))}
                                            value={selectedVariations[product.id] || ""}
                                        >
                                            <option value="">Choose variation</option>
                                            {product.variations.filter(v => v.status).map(variation => (
                                                <option key={variation.id} value={variation.id}>
                                                    {variation.sku}
                                                </option>
                                            ))}
                                        </select>

                                        {selectedVariation && (
                                            <div className="mt-2 flex justify-between items-center bg-gray-50 p-2 rounded">
                                                <span className="font-medium">Price:</span>
                                                <div className="flex items-center">
                                                    <DollarSign className="w-4 h-4 text-gray-500" />
                                                    <span className="font-medium">{selectedVariation.price}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="pt-2">
                                    <button
                                        className={`w-full py-2 rounded-md font-medium transition-colors ${
                                            selectedVariation
                                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                        disabled={!selectedVariation}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </>
    );
};

export default Products;
