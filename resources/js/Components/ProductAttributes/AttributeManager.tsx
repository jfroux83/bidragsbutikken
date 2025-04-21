import {useState} from "react";
import {Plus} from "lucide-react";
import AttributeList from "@/Components/ProductAttributes/AttributeList";
import AttributeForm from "@/Components/ProductAttributes/AttributeForm";
import {Attribute, AttributeValue} from "./types";
import axios from "axios";

interface Props {
    initialAttributes: Attribute[];
}

const AttributeManager = ({ initialAttributes }: Props) => {

    const [attributes, setAttributes] = useState<Attribute[]>(initialAttributes);
    const [isAddingAttribute, setIsAddingAttribute] = useState(false);
    const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
    const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        type: 'attribute' | 'value';
        attributeId: number;
        valueId?: number;
        name: string;
    } | null>(null);

    const handleCreateAttribute = async (name: string, values: AttributeValue[]) => {
        try {
            const response = await axios.post('/vendor/product/attribute', {
                name,
                values: values.map(v => v.value)
            });

            setAttributes([...attributes, response.data]);
            setIsAddingAttribute(false);
        } catch (error) {
            console.error('Error creating attribute:', error);
        }
    };

    const handleUpdateAttribute = async (name: string, values: AttributeValue[]) => {

    };

    const handleDeleteAttribute = async () => {

    };

    const handleAddAttributeValue = async (attributeId: number) => {

    };

    const handleEditAttributeValue = async (attributeId: number, valueId: number, value: string) => {

    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Product Attributes</h2>
                <button
                    onClick={() => setIsAddingAttribute(true)}
                    disabled={isAddingAttribute || !!editingAttribute}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm inline-flex items-center"
                >
                    <Plus size={16} className="mr-1" /> Add Attribute
                </button>
            </div>

            {(isAddingAttribute || editingAttribute) && (
                <div className="border rounded-md p-4 bg-gray-50">
                    <h3 className="text-lg font-medium mb-4">
                        {editingAttribute ? 'Edit Attribute' : 'Add New Attribute'}
                    </h3>
                    <AttributeForm
                        attributeId={editingAttribute?.id}
                        initialName={editingAttribute?.name}
                        initialValues={editingAttribute?.values || []}
                        onSubmit={editingAttribute ? handleUpdateAttribute : handleCreateAttribute}
                        onCancel={() => {
                            setIsAddingAttribute(false);
                            setEditingAttribute(null);
                        }}
                    />
                </div>
            )}

            <AttributeList
                attributes={attributes}
                onEditAttribute={setEditingAttribute}
                onDeleteAttribute={(attributeId) => {
                    const attribute = attributes.find(a => a.id === attributeId);
                    if (attribute) {
                        setDeleteModal({
                            open: true,
                            type: 'attribute',
                            attributeId,
                            name: attribute.name
                        });
                    }
                }}
                onAddAttributeValue={handleAddAttributeValue}
                onEditAttributeValue={handleEditAttributeValue}
                onDeleteAttributeValue={(attributeId, valueId) => {
                    const attribute = attributes.find(a => a.id === attributeId);
                    const value = attribute?.values.find(v => v.id === valueId);
                    if (attribute && value) {
                        setDeleteModal({
                            open: true,
                            type: 'value',
                            attributeId,
                            valueId,
                            name: `${value.value} from ${attribute.name}`
                        });
                    }
                }}
            />

            {deleteModal && (
                // TODO: Confirm Delete Modal
                <div></div>
            )}
        </div>
    );
};

export default AttributeManager;
