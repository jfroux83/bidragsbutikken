import React, {useMemo, useState} from "react";

interface Item {
    value: number | string;
    label: string;
}

interface Props {
    label: string;
    availableItems: Item[];
    selectedItems: (number | string)[];
    onChange: (selectedIs: (number | string)[]) => void;
    id?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

const MultiSelectPillInput = ({
    label,
    availableItems,
    selectedItems,
    onChange,
    id: propId,
    placeholder = 'Select an item...',
    className = '',
    disabled = false,
}: Props) => {

    const componentId = propId || `multi-select-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const [currentItemId, setCurrentItemId] = useState<string>('');

    const filteredAvailableItems = useMemo(() => {
        const selectedSet = new Set(selectedItems);
        return availableItems.filter(item => !selectedSet.has(item.value));
    }, [availableItems, selectedItems]);

    const selectedItemObjects = useMemo(() => {
        const itemMap = new Map(availableItems.map(item => [item.value, item]));
        return selectedItems.map(id => itemMap.get(id)).filter(item => item !== undefined) as Item[];
    }, [availableItems, selectedItems]);

    const handleAddItem = () => {
        if (!currentItemId || disabled) return;

        const idToAdd = isNaN(Number(currentItemId)) ? currentItemId : Number(currentItemId);

        // Ensure it's not already selected (double check)
        if (!selectedItems.includes(idToAdd)) {
            onChange([...selectedItems, idToAdd]);
        }
        // Reset dropdown selection
        setCurrentItemId('');
    };

    // Handler to remove an item by clicking its pill's 'x' button
    const handleRemoveItem = (idToRemove: number | string) => {
        if (disabled) return;
        onChange(selectedItems.filter(id => id !== idToRemove));
    };

    // Handle key press on select (e.g., Enter to add)
    const handleSelectKeyPress = (e: React.KeyboardEvent<HTMLSelectElement>) => {
        if (e.key === 'Enter' && currentItemId) {
            e.preventDefault(); // Prevent form submission if applicable
            handleAddItem();
        }
    }

    return (
        <div className={`mb-4 ${className}`}>
            {/* Label */}
            <label htmlFor={componentId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>

            {/* Selected Items Pills */}
            <div className="mb-2 flex flex-wrap gap-2 min-h-[30px]">
                {selectedItemObjects.length === 0 && !disabled && (
                    <span className="text-xs text-gray-500 italic">No {label.toLowerCase()} selected.</span>
                )}
                {selectedItemObjects.map((item) => (
                    <span
                        key={item.value}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                            disabled
                                ? 'bg-gray-200 text-gray-500'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100'
                        }`}
                    >
                        {item.label}
                        {!disabled && (
                            <button
                                type="button" // Prevent form submission
                                onClick={() => handleRemoveItem(item.value)}
                                className="ml-1.5 flex-shrink-0 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-600 hover:text-blue-500 dark:hover:text-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                aria-label={`Remove ${item.label}`}
                            >
                                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                </svg>
                            </button>
                        )}
                    </span>
                ))}
            </div>

            {/* Add Item Controls */}
            <div className="flex items-center gap-2">
                <select
                    id={componentId}
                    value={currentItemId}
                    onChange={(e) => setCurrentItemId(e.target.value)}
                    onKeyPress={handleSelectKeyPress}
                    disabled={disabled || filteredAvailableItems.length === 0}
                    className={`flex-grow block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200 ${disabled || filteredAvailableItems.length === 0 ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''}`}
                >
                    <option value="" disabled>{filteredAvailableItems.length === 0 ? `All ${label.toLowerCase()} selected` : placeholder}</option>
                    {filteredAvailableItems.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
                <button
                    type="button" // Important: Prevent default form submission
                    onClick={handleAddItem}
                    disabled={!currentItemId || disabled}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800`}
                >
                    Add
                </button>
            </div>
        </div>
    );
};

export default MultiSelectPillInput;
