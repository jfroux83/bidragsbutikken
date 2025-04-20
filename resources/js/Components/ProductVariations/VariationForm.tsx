import {useState} from "react";
import {X} from "lucide-react";

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
    variation: ProductVariation;
    onSubmit: (variation: ProductVariation) => void;
    onCancel: () => void;
}

const VariationForm = ({
    variation,
    onSubmit,
    onCancel
}: Props) => {

    const [formData, setFormData] = useState<ProductVariation>({ ...variation });

    const handleOptionChange = (index: number, field: keyof ProductVariationOption, value: string) => {
        const updatedOptions = [...formData.options];
        updatedOptions[index] = { ...updatedOptions[index], [field]: value };
        setFormData({ ...formData, options: updatedOptions });
    };

    const handleRemoveOption = (index: number) => {
        const updatedOptions = formData.options.filter((_, i) => i !== index);
        setFormData({ ...formData, options: updatedOptions });
    };

    const handleSubmit = () => {};

    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Variation Options */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Variation Options</label>
                {formData.options.map((option, index) => (
                    <div key={index} className="flex items-start space-x-2 mb-2">
                        <div className="w-1/3">
                            <input
                                type="text"
                                placeholder="Attribute Name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={option.attribute_name}
                                onChange={(e) => handleOptionChange(index, 'attribute_name', e.target.value)}
                            />
                        </div>
                        <div className="flex-1">
                            {option.attribute_name.toLowerCase() === 'size' ? (
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    value={option.attribute_value}
                                    onChange={(e) => handleOptionChange(index, 'attribute_value', e.target.value)}
                                >
                                    <option value="">Select Size</option>
                                    {sizeOptions.map(size => (
                                        <option key={size} value={size}>{size}</option>
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


            </div>
        </form>
    );
};

export default VariationForm;
