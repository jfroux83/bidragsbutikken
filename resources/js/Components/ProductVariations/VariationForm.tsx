import React, {useState} from "react";
import {Plus, X} from "lucide-react";

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

interface AttributeOption {
    name: string;
    values: string[];
}

interface Props {
    variation: ProductVariation;
    onSubmit: (variation: ProductVariation) => void;
    onCancel: () => void;
    availableAttributes?: AttributeOption[];
}

const VariationForm = ({
    variation,
    onSubmit,
    onCancel,
    availableAttributes,
}: Props) => {

    const [formData, setFormData] = useState<ProductVariation>({ ...variation });

    const handleOptionChange = (index: number, field: keyof ProductVariationOption, value: string) => {
        const updatedOptions = [...formData.options];
        updatedOptions[index] = { ...updatedOptions[index], [field]: value };
        setFormData({ ...formData, options: updatedOptions });
    };

    const handleAddOption = () => {
        setFormData({
            ...formData,
            options: [...formData.options, { attribute_name: '', attribute_value: '' }]
        });
    };

    const handleRemoveOption = (index: number) => {
        const updatedOptions = formData.options.filter((_, i) => i !== index);
        setFormData({ ...formData, options: updatedOptions });
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    // Find the attribute options for a given attribute name
    const getAttributeValues = (attributeName: string): string[] => {
        const attribute = availableAttributes.find(
            attr => attr.name.toLowerCase() === attributeName.toLowerCase()
        );
        return attribute?.values || [];
    };

    return (
        <div className="space-y-4">
            {/* Variation Options */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Variation Options</label>
                {formData.options.map((option, index) => (
                    <div key={index} className="flex items-start space-x-2 mb-2">
                        <div className="w-1/3">
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={option.attribute_name}
                                onChange={(e) => handleOptionChange(index, 'attribute_name', e.target.value)}
                            >
                                <option value="">Select Attribute</option>
                                {availableAttributes.map(attr => (
                                    <option key={attr.name} value={attr.name}>{attr.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            {option.attribute_name && getAttributeValues(option.attribute_name).length > 0 ? (
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    value={option.attribute_value}
                                    onChange={(e) => handleOptionChange(index, 'attribute_value', e.target.value)}
                                >
                                    <option value="">Select {option.attribute_name}</option>
                                    {getAttributeValues(option.attribute_name).map(value => (
                                        <option key={value} value={value}>{value}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    placeholder="Attribute Value"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    value={option.attribute_value}
                                    onChange={(e) => handleOptionChange(index, 'attribute_value', e.target.value)}
                                />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveOption(index)}
                            className="p-2 text-red-500 hover:text-red-700"
                            disabled={formData.options.length <= 1}
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleAddOption}
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    <Plus size={16} className="mr-1" /> Add Option
                </button>
            </div>

            {/* SKU */}
            <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
                <input
                    type="text"
                    id="sku"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
            </div>

            {/* Price */}
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                        type="number"
                        id="price"
                        className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    />
                </div>
            </div>

            {/* Stock */}
            <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                    type="number"
                    id="stock"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                />
            </div>

            {/* Active Status */}
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="is_active"
                    className="h-4 w-4 text-green-600 border-gray-300 rounded"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                    Active
                </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                    {variation.id ? 'Update' : 'Add'} Variation
                </button>
            </div>

        </div>
    );
};

export default VariationForm;
