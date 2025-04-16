import React, {useState} from "react";
import {Head, router} from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import PageLayout from "@/Components/UI/PageLayout";
import {ClientDataTable} from "@/Components/DataTable/ClientDataTable";
import {Action, BaseColumn} from "@/Components/DataTable/DataTable";
import ConfirmationDialog from "@/Components/UI/ConfirmationDialog";
import {Edit, Plus, Trash2} from "lucide-react";

interface Product {
    id: number;
    status: boolean;
    name: string;
    base_price: number;
    is_subscribable: boolean;
}

interface Props {
    products: Product[];
}

const Index = ({
    products
}: Props) => {

    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
    const [recordToDelete, setRecordToDelete] = useState<Product | null>(null);

    const columns: BaseColumn<Product>[] = [
        {
            key: 'name',
            title: 'Name',
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'search...'
            },
            sortable: true,
        },
        {
            key: 'status',
            title: 'Status',
            type: 'status',
            config: {
                status: {
                    'true': { label: 'Active', className: 'text-green-800 bg-green-100' },
                    'false': { label: 'Inactive', className: 'text-gray-800 bg-red-100' },
                }
            }
        },
        {
            key: 'is_subscribable',
            title: 'Subscribable',
            type: 'status',
            config: {
                status: {
                    'true': { label: 'Yes', className: 'text-green-800 bg-green-100' },
                    'false': { label: 'No', className: 'text-gray-800 bg-red-100' },
                }
            }
        },
        {
            key: 'base_price',
            title: 'Base Price',
            formatter: (value: number) => (
                <span className="text-right">{value}</span>
            )
        },
    ];

    const handleCreate = () => {
        router.get('/vendor/product/create');
    };

    const handleEdit = (product: Product) => {
        router.get(`/vendor/product/${product.id}/edit`);
    };

    const handleDelete = (product: Product) => {};

    const confirmDelete = () => {};

    const actionsRoot = [
        { icon: Plus, label: 'Create Product', onClick: handleCreate }
    ];

    const actions: Action<Product>[] = [
        { icon: Edit, label: 'Edit Product', onClick: handleEdit, variant: 'secondary' },
        { icon: Trash2, label: 'Delete Product', onClick: handleDelete, variant: 'danger' }
    ];

    return (
        <VendorLayout>
            <Head title="Products" />
            <PageLayout
                title="Products"
                actions={actionsRoot}
            >
                <ClientDataTable
                    columns={columns}
                    data={products}
                    actions={actions}
                />

                <ConfirmationDialog
                    isOpen={deleteConfirm}
                    onClose={() => {
                        setDeleteConfirm(false);
                        setRecordToDelete(null);
                    }}
                    onConfirm={confirmDelete}
                    title='Delete Product'
                    message={`Are you sure you want to delete product ${recordToDelete?.name}? This action cannot be undone.`}
                    confirmText='Delete'
                    type='danger'
                />
            </PageLayout>
        </VendorLayout>
    );
};

export default Index;
