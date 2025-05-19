import {useEffect, useRef, useState} from "react";

const Select = ({
    name,
    label,
    value,
    options,
    error,
    onChange,
    required = false,
    disabled = false,
    placeholder = '',
    multiple = false,
    searchable = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
    const filteredOptions = options.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);

    }, []);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const handleOptionClick = (option) => {
        if (multiple) {
            const newValue = selectedValues.includes(option.value)
                ? selectedValues.filter(v => v !== option.value)
                : [...selectedValues, option.value];
            onChange(name, newValue);
        } else {
            onChange(name, option.value);
            setIsOpen(false);
        }
        setSearchTerm('');
    };

    const getDisplayValue = () => {
        if (selectedValues.length === 0) return placeholder || 'Select...';

        const selectedLabels = selectedValues
            .map(val => options.find(opt =>
                typeof opt.value === 'number'
                    ? opt.value === Number(val)
                    : opt.value === val
            )?.label)
            .filter(Boolean);

        return multiple ? selectedLabels.join(', ') : selectedLabels[0];
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    }

    return (
        <div className="relative my-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div ref={dropdownRef} onKeyDown={handleKeyDown}>
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`w-full px-3 py-2 text-left bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:[#0E4F6C] ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-[#0E4F6C]'} ${error ? 'border-red-500' : 'border-gray-300'}`}
                >
                    <span className={`block truncate ${!value ? 'text-gray-500': ''}`}>
                        {getDisplayValue()}
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {searchable && (
                            <div className="sticky top-0 p-2 bg-white border-b border-gray-200">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    className="w-full px-3 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E4F6C]"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    onClick={e => e.stopPropagation()}
                                />
                            </div>
                        )}

                        <div className="py-1">
                            {filteredOptions.length === 0 ? (
                                <div className="px-3 py-2 text-gray-500 text-sm">
                                    No options found
                                </div>
                            ) : (
                                filteredOptions.map(option => (
                                    <div
                                        key={option.value}
                                        onClick={() => handleOptionClick(option)}
                                        className={`px-3 py-2 cursor-pointer flex items-center ${selectedValues.includes(option.value)
                                            ? 'bg-blue-100 text-[#0E4F6C]'
                                            : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        {multiple && (
                                            <input
                                                type="checkbox"
                                                checked={selectedValues.includes(option.value)}
                                                onChange={() => {}}
                                                className="mr-2"
                                            />
                                        )}
                                        {option.label}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

export default Select;
