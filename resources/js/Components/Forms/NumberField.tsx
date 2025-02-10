import React from "react";

interface Props {
    name: string;
    label: string;
    required: boolean;
    min?: number;
    max?: number;
    value: number;
    step?: number;
    disabled?: boolean;
    placeholder?: string
    error?: string
    className?: string
    onChange: (value: number) => void
}

const NumberField = ({
    name,
    label,
    required = false,
    min,
    max,
    value = 0,
    step,
    disabled = false,
    placeholder = '',
    error,
    className = '',
    onChange
}: Props) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value === '' ? null : Number(e.target.value);

        // Validate min/max constraints
        if (newValue !== null) {
            if (min !== undefined && newValue < min) return;
            if (max !== undefined && newValue > max) return;
        }

        onChange(newValue);
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select(); // Select the entire value on focus
    };

    return (
        <div className="space-y-2 my-4">
            <div className="flex justify-between items-center">
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {(min !== undefined || max !== undefined) && (
                    <span className="text-xs text-gray-500">
                        {min !== undefined && `Min: ${min}`}
                        {min !== undefined && max !== undefined && ' | '}
                        {max !== undefined && `Max: ${max}`}
                    </span>
                )}
            </div>

            <input
                type="number"
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                min={min}
                max={max}
                step={step ?? 1}
                disabled={disabled}
                required={required}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0E4F6C] focus:border-[#0E4F6C]
                    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                    ${error ? 'border-red-500' : 'border-gray-200'}
                    ${className || ''}`
                }
            />

            {error && (
                <p className="text-sm text-red-500 mt-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default NumberField;
