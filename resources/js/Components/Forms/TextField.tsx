import React from "react";

const TextField = ({
    name,
    label,
    value = '',
    onChange,
    error,
    disabled = false,
    required = false,
    placeholder = '',
}) => {
    return (
        <div className="space-y-1 my-4">
            {/* Label */}
            <div className="flex justify-between items-center">
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            </div>

            {/* Input */}
            <input
                type="text"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 ease-in-out ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} ${error ? 'border-red-500' : 'border-gray-200'}`}
            />

            {/* Error message */}
            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}

export default TextField;
