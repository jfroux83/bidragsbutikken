import React, {useId, useState} from "react";
import {ProductVariationsManagerProps, Variation, VariationOption} from "@/Components/Product/types";
import {Edit, Trash2} from "lucide-react";
import TextField from "@/Components/Forms/TextField";
import NumberField from "@/Components/Forms/NumberField";
import Checkbox from "@/Components/Forms/Checkbox";

const ProductVariationsManager: React.FC<ProductVariationsManagerProps> = ({
    initialVariations = [],
    onChange,
    attributeNames,
    basePrice = 0,
    errors, // Example: errors could be like { 'variations.0.sku': 'SKU required', 'variations.1.price': '...' }
    disabled = false,
}) => {

    // Internal state to manage the list of variations
    const [variations, setVariations] = useState<Variation[]>([]);
    // State to hold the data of the variation being currently added/edited
    const [currentVariation, setCurrentVariation] = useState<Partial<Variation>>({});
    // State to track which variation is being edited (index or null/undefined for new)
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const formSectionId = useId(); // Unique ID for aria-labelledby

    // ---- Helper Functions ----

    const resetCurrentVariationForm = () => {
        const initialOptions = attributeNames.reduce((acc, name) => {
            acc.push({ attribute_name: name, attribute_value: '' });
            return acc;
        }, [] as VariationOption[]);

        setCurrentVariation({
            sku: '',
            price: '', // Keep as string for input binding
            stock: '', // Keep as string for input binding
            is_active: true,
            options: initialOptions,
        });
        setEditingIndex(null); // Ensure we are in "add mode"
    };

    // Notify parent component of changes
    const triggerOnChange = (updatedVariations: Variation[]) => {
        // Filter out variations marked for deletion before sending to parent
        // Or keep them and let the backend handle the _delete flag
        onChange(updatedVariations);
        setVariations(updatedVariations); // Update internal state as well
    };

    // ---- Event Handlers ----

    const handleInputChange = (field: keyof Variation | `options.${number}.attribute_value`, value: any) => {
        setCurrentVariation(prev => {
            const newState = { ...prev };
            if (typeof field === 'string' && field.startsWith('options.')) {
                const [, indexStr, subField] = field.split('.');
                const index = parseInt(indexStr, 10);
                if (newState.options && newState.options[index] && subField === 'attribute_value') {
                    // Create a new options array to ensure state update correctly triggers re-render
                    newState.options = [
                        ...newState.options.slice(0, index),
                        { ...newState.options[index], attribute_value: value },
                        ...newState.options.slice(index + 1)
                    ];
                }
            } else if (field !== 'options') {
                // Handle top-level fields (sku, price, stock, is_active)
                // @ts-ignore // Ignore potential type mismatch for dynamic keys
                newState[field as keyof Omit<Variation, 'options'>] = value;
            }
            return newState;
        });
    };

    const handleEditVariation = (index: number) => {
        if (disabled) return;
        setEditingIndex(index);
        // Ensure price/stock are strings for input binding when editing
        const variationToEdit = variations[index];
        setCurrentVariation({
            ...variationToEdit,
            price: String(variationToEdit.price),
            stock: String(variationToEdit.stock),
        });
    };

    const handleRemoveVariation = (indexToRemove: number) => {
        if (disabled) return;
        if (!confirm('Are you sure you want to remove this variation?')) {
            return;
        }

        const variationToRemove = variations[indexToRemove];
        let updatedVariations: Variation[];

        if (typeof variationToRemove.id === 'number') {
            // If it has a real ID, mark for deletion instead of removing from list immediately
            // This allows the backend to handle the actual deletion.
            updatedVariations = variations.map((v, index) =>
                index === indexToRemove ? { ...v, _delete: true } : v
            );
        } else {
            // If it's a temporary one (no real ID), just remove it from the list
            updatedVariations = variations.filter((_, index) => index !== indexToRemove);
        }


        triggerOnChange(updatedVariations);

        // If the removed variation was the one being edited, reset the form
        if (editingIndex === indexToRemove) {
            resetCurrentVariationForm();
        }
    };

    // Helper to get error for a specific variation field
    const getError = (index: number, field: string) => {
        const key = `variations.${index}.${field}`;
        // Handle nested options errors if backend provides them like 'variations.0.options.0.attribute_value'
        // For simplicity now, just checking top-level fields
        return errors?.[key];
    }

    // Filter out variations marked for deletion for display purposes
    const displayVariations = variations.filter(v => !v._delete);

    // ---- Render Component ----
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 mt-6 mb-4">
            <h3 id={formSectionId} className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 mb-4">
                Product Variations
            </h3>

            {/*  Display Existing Variations Table/List  */}
            <div className="mb-6 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        {displayVariations.length === 0 ? (
                            <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">No variations added yet.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                                <thead>
                                <tr>
                                    {attributeNames.map(name => (
                                        <th key={name} scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0">{name}</th>
                                    ))}
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">SKU</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Price</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Stock</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Active</th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {variations.map((variation, index) => (
                                    // Only render rows not marked for deletion
                                    !variation._delete && (
                                        <tr key={variation.id} className={`${editingIndex === index ? 'bg-blue-50 dark:bg-gray-800' : ''}`}>
                                            {attributeNames.map((name, optIndex) => (
                                                <td key={optIndex} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-0">
                                                    {variation.options.find(o => o.attribute_name === name)?.attribute_value || '-'}
                                                </td>
                                            ))}
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{variation.sku}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                {/* Format price if needed */}
                                                {typeof variation.price === 'number' ? variation.price.toFixed(2) : variation.price}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{variation.stock}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                {variation.is_active ? (
                                                    <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-200">Yes</span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:text-red-200">No</span>
                                                )}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                <div className='flex justify-end space-x-2'>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditVariation(index)}
                                                        disabled={disabled || editingIndex === index} // Disable if already editing this one
                                                        className={`text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                                                        title="Edit Variation"
                                                    >
                                                        <Edit className="h-4 w-4" /> <span className="sr-only">Edit</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveVariation(index)}
                                                        disabled={disabled}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Remove Variation"
                                                    >
                                                        <Trash2 className="h-4 w-4" /> <span className="sr-only">Remove</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Add/Edit Variation Form */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-3">
                    {editingIndex !== null ? 'Edit Variation' : 'Add New Variation'}
                </h4>
                <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                    {/* Dynamic Attribute Fields */}
                    {currentVariation.options?.map((option, index) => (
                        <div className="sm:col-span-3" key={option.attribute_name}>
                            {/* Assuming TextField can handle label, name, value, onChange, error */}
                            <TextField
                                name={`options.${index}.attribute_value`}
                                label={option.attribute_name} // e.g., "Size", "Color"
                                value={option.attribute_value}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(`options.${index}.attribute_value`, e.target.value)}
                                // Pass specific error for this field if available
                                error={getError(editingIndex ?? -1, `options.${index}.attribute_value`)} // Need backend to map errors correctly
                                disabled={disabled}
                                required
                            />
                        </div>
                    ))}

                    <div className="sm:col-span-3">
                        <TextField
                            name="sku"
                            label="SKU"
                            value={currentVariation.sku ?? ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('sku', e.target.value)}
                            error={getError(editingIndex ?? -1, 'sku')} // Example error prop
                            disabled={disabled}
                            required
                        />
                    </div>

                    <div className="sm:col-span-2">
                        {/* Use NumberField if it handles number conversion, else use TextField type="number" */}
                        {/*<NumberField*/}
                        {/*    name="price"*/}
                        {/*    label="Price"*/}
                        {/*    value={currentVariation.price ?? ''}*/}
                        {/*    onChange={(value: number | string) => handleInputChange('price', value)} // Assuming NumberField passes value directly*/}
                        {/*    error={getError(editingIndex ?? -1, 'price')}*/}
                        {/*    disabled={disabled}*/}
                        {/*    required*/}
                        {/*    step="0.01" // For currency*/}
                        {/*/>*/}
                    </div>

                    <div className="sm:col-span-2">
                        {/*<NumberField*/}
                        {/*    name="stock"*/}
                        {/*    label="Stock"*/}
                        {/*    value={currentVariation.stock ?? ''}*/}
                        {/*    onChange={(value: number | string) => handleInputChange('stock', value)}*/}
                        {/*    error={getError(editingIndex ?? -1, 'stock')}*/}
                        {/*    disabled={disabled}*/}
                        {/*    required*/}
                        {/*    step="1" // Integer stock*/}
                        {/*/>*/}
                    </div>

                    <div className="sm:col-span-2 flex items-end pb-2"> {/* Adjust alignment */}
                        {/*<Checkbox*/}
                        {/*    name="is_active"*/}
                        {/*    label="Is Active?"*/}
                        {/*    checked={currentVariation.is_active ?? true}*/}
                        {/*    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('is_active', e.target.checked)}*/}
                        {/*    error={getError(editingIndex ?? -1, 'is_active')}*/}
                        {/*    disabled={disabled}*/}
                        {/*/>*/}
                    </div>
                </div>

                {/* Form Action Buttons */}
            {/*    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse space-y-2 sm:space-y-0 sm:space-x-3 sm:space-x-reverse">*/}
            {/*        <Button*/}
            {/*            type="button"*/}
            {/*            onClick={handleSaveVariation}*/}
            {/*            disabled={disabled || processing} // Pass processing state from parent if needed*/}
            {/*            variant='primary' // Assuming Button has variants*/}
            {/*            icon={editingIndex !== null ? undefined : PlusCircle}*/}
            {/*        >*/}
            {/*            {editingIndex !== null ? 'Update Variation' : 'Add Variation'}*/}
            {/*        </Button>*/}
            {/*        {editingIndex !== null && (*/}
            {/*            <Button*/}
            {/*                type="button"*/}
            {/*                onClick={handleCancelEdit}*/}
            {/*                disabled={disabled}*/}
            {/*                variant='secondary' // Assuming Button has variants*/}
            {/*                icon={X}*/}
            {/*            >*/}
            {/*                Cancel Edit*/}
            {/*            </Button>*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*    /!* Display general variation errors if backend returns them at the top level *!/*/}
            {/*    {errors?.variations && typeof errors.variations === 'string' && (*/}
            {/*        <InputError message={errors.variations} className="mt-2" />*/}
            {/*    )}*/}
            {/*</div>*/}

        </div>

        </div>
    );
};

export default ProductVariationsManager;
