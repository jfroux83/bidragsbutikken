import {useState} from "react";
import {Plus} from "lucide-react";
import AttributeList from "@/Components/ProductAttributes/AttributeList";
import AttributeForm from "@/Components/ProductAttributes/AttributeForm";
import ConfirmDeleteModal from "@/Components/ProductAttributes/ConfirmDeleteModal";
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
        if (!editingAttribute) return;

        try {
            const response = await axios.put(`/vendor/product/attribute/${editingAttribute.id}`, {
                name,
                values
            });

            setAttributes(attributes.map(attr =>
                attr.id === editingAttribute.id ? response.data : attr
            ));
            setEditingAttribute(null);
        } catch (error) {
            console.error('Error updating attribute:', error);
        }
    };

    const handleDeleteAttribute = async () => {
        if (!deleteModal || deleteModal.type !== 'attribute') return;

        try {
            await axios.delete(`/vendor/product/attribute/${deleteModal.attributeId}`);

            setAttributes(attributes.filter(attr => attr.id !== deleteModal.attributeId));
            setDeleteModal(null);
        } catch (error) {
            console.error('Error deleting attribute:', error);
        }
    };

    const handleAddAttributeValue = async (attributeId: number) => {
        const attribute = attributes.find(attr => attr.id === attributeId);
        if (attribute) {
            setEditingAttribute(attribute);
        }
    };

    const handleEditAttributeValue = async (attributeId: number, valueId: number, value: string) => {
        try {
            await axios.put(`/vendor/product/attribute/${attributeId}/values/${valueId}`, {
                value
            });

            setAttributes(attributes.map(attr => {
                if (attr.id === attributeId) {
                    return {
                        ...attr,
                        values: attr.values.map(v => v.id === valueId ? { ...v, value } : v)
                    };
                }
                return attr;
            }));
        } catch (error) {
            console.error('Error updating attribute value:', error);
        }
    };

    const handleDeleteAttributeValue = async (attributeId: number, valueId: number) => {
        if (deleteModal?.type === 'value') {
            try {
                await axios.delete(`/vendor/product/attribute/${attributeId}/values/${valueId}`);

                setAttributes(attributes.map(attr => {
                    if (attr.id === attributeId) {
                        return {
                            ...attr,
                            values: attr.values.filter(v => v.id !== valueId)
                        };
                    }
                    return attr;
                }));
            } catch (error) {
                console.error('Error deleting attribute value:', error);
            }
        }
        setDeleteModal(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end items-center">
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
                <ConfirmDeleteModal
                    isOpen={deleteModal.open}
                    itemName={deleteModal.name}
                    onConfirm={deleteModal.type === 'attribute' ? handleDeleteAttribute : () => {
                        if (deleteModal.valueId) {
                            handleDeleteAttributeValue(deleteModal.attributeId, deleteModal.valueId);
                        }
                    }}
                    onCancel={() => setDeleteModal(null)}
                />
            )}
        </div>
    );
};

export default AttributeManager;
