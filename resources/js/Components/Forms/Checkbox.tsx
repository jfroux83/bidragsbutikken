const Checkbox = ({
    name,
    label,
    value,
    options,
    error,
    onChange,
    required = false,
    disabled = false,
    cols = 1,
    containerHeight = '300px',
}) => {
    const selectedValues = Array.isArray(value) ? value : [];

    const handleChange = (optionValue) => {
        if (disabled) return;

        const newValue = selectedValues.includes(optionValue)
            ? selectedValues.filter(v => v !== optionValue)
            : [...selectedValues, optionValue];
        onChange(name, newValue);
    }

    const getGridClass = (cols) => {
        switch (cols) {
            case 2:
                return 'grid-cols-2';
            case 3:
                return 'grid-cols-3';
            case 4:
                return 'grid-cols-4';
            default:
                return 'grid-cols-1';
        }
    }

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div className="relative">
                <div
                    className={`overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 pr-2`}
                    style={{height: containerHeight}}
                >
                    <div className={`grid ${getGridClass(cols)} gap-4 content-start`}>
                        {options.map((option) => (
                            <label
                                key={option.value}
                                className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${selectedValues.includes(option.value) ? 'bg-[#C2E9F5] border-[#508ABE]' : 'bg-white border-gray-200 hover:bg-gray-50'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    name={name}
                                    value={option.value}
                                    checked={selectedValues.includes(option.value)}
                                    onChange={() => handleChange(option.value)}
                                    disabled={disabled}
                                    className="h4 w-4 rounded border-gray-200 text-green-600 focus:ring-green-500 disabled:opacity-50"
                                />
                                <span className="ml-3 text-sm text-gray-900">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

export default Checkbox;
