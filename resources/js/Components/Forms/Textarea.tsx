import React, {useEffect, useState} from "react";

interface Props {
    name: string;
    label: string;
    value: string;
    error?: string;
    onChange: (name: string, value: string) => void;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    rows?: number;
    maxLength?: number;
}

const Textarea = ({
    name,
    label,
    value = '',
    error,
    onChange,
    required = false,
    disabled = false,
    placeholder,
    className,
    rows = 5,
    maxLength = 50,
}) => {
    const [charCount, setCharCount] = useState(0);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setCharCount(value?.length || 0);
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = e.target.value;

        // Check maxLength constraint
        if (maxLength && newValue.length > maxLength) {
            return;
        }

        onChange(name, newValue);
        setCharCount(newValue.length);
    }

    return (
        <div className={`space-y-1 ${className}`}>
            {/* Label */}
            <div className="flex justify-between items-center">
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {/* Character count for maxLength fields */}
                {maxLength && (
                    <span
                        className={`text-xs ${
                            charCount >= (maxLength * 0.9)
                                ? 'text-red-500'
                                : 'text-gray-500'
                        }`}
                    >
                        {charCount}/{maxLength}
                    </span>
                )}
            </div>

            {/* Input field */}
            <textarea
                id={name}
                name={name}
                value={value || ''}
                onChange={handleChange}
                disabled={disabled}
                required={required}
                placeholder={placeholder}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out
                    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                    ${error ? 'border-red-500' : 'border-gray-200'}
                    ${className || ''}`}
                aria-describedby={error ? `${name}-error` : undefined}
                aria-invalid={error ? 'true' : 'false'}
                rows={rows}
            />

            {/* Error message */}
            {error && (
                <p
                    className="text-sm text-red-500 mt-1"
                    id={`${name}-error`}
                >
                    {error}
                </p>
            )}
        </div>
    );
};

export default Textarea;
