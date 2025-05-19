import {useState} from "react";
import Card from "@/Components/Card/Card";
import CardHeader from "@/Components/Card/CardHeader";
import CardTitle from "@/Components/Card/CardTitle";
import CardContent from "@/Components/Card/CardContent";
import {Product, Variation} from "@/Pages/Customer/types";
import {Box, DollarSign, Repeat, ShoppingCart, Tag} from "lucide-react";

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

    const renderActionButtons = (product: Product, hasVariations: boolean, selectedVariation: Variation | null) => {
        const isButtonDisabled = hasVariations && !selectedVariation;

        const subscribeButtonClasses = `flex justify-center items-center gap-2 py-2 rounded-md font-medium transition-colors ${
            isButtonDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
        }`;

        const buyButtonClasses = `flex justify-center items-center gap-2 py-2 rounded-md font-medium transition-colors ${
            isButtonDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white border border-green-600 hover:bg-gray-50 text-green-600'
        }`;

        switch (product.type) {
            case 'both':
                return (
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            className={subscribeButtonClasses}
                            disabled={isButtonDisabled}
                        >
                            <Repeat className="w-4 h-4" />
                            Subscribe
                        </button>
                        <button
                            className={buyButtonClasses}
                            disabled={isButtonDisabled}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            Buy
                        </button>
                    </div>
                );

            case 'subscription':
                return (
                    <button
                        className={`w-full ${subscribeButtonClasses}`}
                        disabled={isButtonDisabled}
                    >
                        <Repeat className="w-4 h-4" />
                        Subscribe
                    </button>
                );

            case 'once-off':
                return (
                    <button
                        className={`w-full ${buyButtonClasses}`}
                        disabled={isButtonDisabled}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Buy
                    </button>
                );

            default:
                return null;
        }
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

                                {product.variations && product.variations.length > 0 ? (
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
                                ) : (
                                    <div className="mt-4">
                                        <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                            <span className="font-medium">Price:</span>
                                            <div className="flex items-center">
                                                <DollarSign className="w-4 h-4 text-gray-500" />
                                                <span className="font-medium">{product.base_price}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-2">
                                    {renderActionButtons(
                                        product,
                                        !!(product.variations && product.variations.length > 0),
                                        selectedVariation
                                    )}
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
