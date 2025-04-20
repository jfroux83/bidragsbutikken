import {Check, Edit, Trash, X} from "lucide-react";

interface ProductVariationOption {
    attribute_name: string;
    attribute_value: string;
}

interface ProductVariation {
    id?: number;
    product_id: number;
    sku: string;
    price: number;
    stock: number;
    is_active: boolean;
    options: ProductVariationOption[];
}

interface Props {
    variations: ProductVariation[];
    onEdit: (variation: ProductVariation) => void;
    onDelete: (variationId: number) => void;
}

const VariationsList = ({
    variations,
    onEdit,
    onDelete
}: Props) => {

    // Find all unique attribute names across all variations
    const allAttributeNames = Array.from(
        new Set(
            variations.flatMap(variation =>
                variation.options.map(option => option.attribute_name)
            )
        )
    );

    const getAttributeValue = (variation: ProductVariation, attributeName: string) => {
          const option = variation.options.find(opt => opt.attribute_name === attributeName);
          return option ? option.attribute_value : '-';
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {allAttributeNames.map(name => (
                            <th
                                key={name}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {name}
                            </th>
                        ))}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            SKU
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {variations.map(variation => (
                        <tr
                            key={variation.id}
                            className="hover:bg-gray-50"
                        >
                            {allAttributeNames.map(name => (
                                <td key={`${variation.id}-${name}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {getAttributeValue(variation, name)}
                                </td>
                            ))}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {variation.sku}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatPrice(variation.price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {variation.stock}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {variation.is_active ? (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        <Check size={16} className="mr-1" /> Active
                                    </span>
                                ) : (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                        <X size={16} className="mr-1" /> Inactive
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEdit(variation)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => variation.id && onDelete(variation.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Trash size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VariationsList;
