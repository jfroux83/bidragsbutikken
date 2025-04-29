import {useState} from "react";
import {Attribute} from "@/Components/ProductAttributes/types";
import {ChevronDown, ChevronUp, Edit, Plus, Trash} from "lucide-react";

interface Props {
    attributes: Attribute[];
    onEditAttribute: (attribute: Attribute) => void;
    onDeleteAttribute: (attributeId: number) => void;
    onAddAttributeValue: (attributeId: number) => void;
    onEditAttributeValue: (attributeId: number, valueId: number, value: string) => void;
    onDeleteAttributeValue: (attributeId: number, valueId: number) => void;
}

const AttributeList = ({
    attributes,
    onEditAttribute,
    onDeleteAttribute,
    onAddAttributeValue,
    onEditAttributeValue,
    onDeleteAttributeValue
}: Props) => {

    const [expandedAttributes, setExpandedAttributes] = useState<number[]>([]);
    const [editingValue, setEditingValue] = useState<{attributeId: number, valueId: number, value: string} | null>(null);

    const toggleExpand = (attributeId: number) => {
        if (expandedAttributes.includes(attributeId)) {
            setExpandedAttributes(expandedAttributes.filter(id => id !== attributeId));
        } else {
            setExpandedAttributes([...expandedAttributes, attributeId]);
        }
    };

    const handleEditValue = (attributeId: number, valueId: number, value: string) => {
        setEditingValue({ attributeId, valueId, value})
    };

    const saveEditedValue = () => {
        if (editingValue) {
            onEditAttributeValue(editingValue.attributeId, editingValue.valueId, editingValue.value);
            setEditingValue(null);
        }
    };

    return (
        <div className="space-y-4">
            {attributes.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-md">
                    <p className="text-gray-500">No attributes added yet.</p>
                </div>
            ) : (
                attributes.map(attribute => (
                    <div key={attribute.id} className="border rounded-md overflow-hidden">
                        <div className="flex items-center justify-between p-4 bg-gray-50">
                            <div className="flex items-center">
                                <button
                                    onClick={() => toggleExpand(attribute.id)}
                                    className="mr-2 text-gray-500"
                                >
                                    {expandedAttributes.includes(attribute.id) ?
                                        <ChevronUp size={18} /> :
                                        <ChevronDown size={18} />
                                    }
                                </button>

                                <h3 className="font-medium">{attribute.name}</h3>
                                <span className="ml-2 text-sm text-gray-500">
                                    ({attribute.values.length} values)
                                </span>
                            </div>
                            <div>
                                <button
                                    onClick={() => onEditAttribute(attribute)}
                                    className="text-green-600 hover:text-green-900 mr-3"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => onDeleteAttribute(attribute.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>

                        {expandedAttributes.includes(attribute.id) && (
                            <div className="p-4 border-t">
                                <div className="space-y-2">
                                    {attribute.values.map(value => (
                                        <div key={value.id} className="flex items-center justify-between py-2 pl-8 pr-2 hover:bg-gray-50 rounded">
                                            {editingValue &&
                                                editingValue.attributeId === attribute.id &&
                                                editingValue.valueId === value.id ? (
                                                    <div className="flex items-center flex-1">
                                                        <input
                                                            type="text"
                                                            value={editingValue.value}
                                                            onChange={(e) => setEditingValue({
                                                                ...editingValue,
                                                                value: e.target.value
                                                            })}
                                                            className="border rounded px-2 py-1 flex-1"
                                                            autoFocus
                                                            onBlur={saveEditedValue}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') saveEditedValue();
                                                                if (e.key === 'Escape') setEditingValue(null);
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span>{value.value}</span>
                                                        <div>
                                                            <button
                                                                onClick={() => handleEditValue(attribute.id, value.id, value.value)}
                                                                className="text-green-600 hover:text-green-900 mr-2"
                                                            >
                                                                <Edit size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => onDeleteAttributeValue(attribute.id, value.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <Trash size={14} />
                                                            </button>
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => onAddAttributeValue(attribute.id)}
                                    className="mt-3 flex items-center text-sm text-green-600 hover:text-green-900"
                                >
                                    <Plus size={14} className="mr-1" /> Add Value
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default AttributeList;
