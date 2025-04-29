import React, {useState} from "react";
import {AttributeValue} from "@/Components/ProductAttributes/types";
import {Plus, X} from "lucide-react";

interface Props {
    attributeId?: number;
    initialName?: string;
    initialValues?: AttributeValue[];
    onSubmit: (name: string, values: AttributeValue[]) => void;
    onCancel: () => void;
}

const AttributeForm = ({
    attributeId,
    initialName = '',
    initialValues = [],
    onSubmit,
    onCancel
}: Props) => {

    const [name, setName] = useState(initialName);
    const [values, setValues] = useState<AttributeValue[]>(initialValues);
    const [newValue, setNewValue] = useState('');
    const [nameError, setNameError] = useState('');
    const [valuesError, setValuesError] = useState('');

    const handleAddValue = () => {
        if (!newValue.trim()) return;

        // Check if value already exists
        if (values.some(v => v.value.toLowerCase() === newValue.trim().toLowerCase())) {
            setValuesError('This value already exists');
            return;
        }

        setValues([...values, {value: newValue.trim() }]);
        setNewValue('');
        setValuesError('');
    };

    const handleRemoveValue = (index: number) => {
        setValues(values.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!name.trim()) {
            setNameError('Attribute name is required');
            return;
        }

        if (values.length === 0) {
            setValuesError('At least one value is required');
            return;
        }

        onSubmit(name.trim(), values);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Attribute Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setNameError('');
                    }}
                    className={`mt-1 block w-full px-3 py-2 border ${
                        nameError ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="e.g. Size, Color, Material"
                />
                {nameError && <p className="mt-1 text-sm text-red-600">{nameError}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Attribute Values</label>
                <div className="mt-1">
                    <div className="flex">
                        <input
                            type="text"
                            value={newValue}
                            onChange={(e) => {
                                setNewValue(e.target.value);
                                setValuesError('');
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                            placeholder="Add a new value"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddValue();
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleAddValue}
                            className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    {valuesError && <p className="mt-1 text-sm text-red-600">{valuesError}</p>}
                </div>

                <div className="mt-3 space-y-2">
                    {values.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No values added yet</p>
                    ) : (
                        values.map((value, index) => (
                            <div
                                key={value.id || `new-${index}`}
                                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md"
                            >
                                <span>{value.value}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveValue(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                    {attributeId ? 'Update' : 'Create'} Attribute
                </button>
            </div>
        </form>
    );
};

export default AttributeForm;
