import React, {useState} from "react";
import {Head, router} from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import PageLayout from "@/Components/UI/PageLayout";
import {ClientDataTable} from "@/Components/DataTable/ClientDataTable";
import ConfirmationDialog from "@/Components/UI/ConfirmationDialog";
import {Action, BaseColumn} from "@/Components/DataTable/DataTable";
import {Pencil, Plus, Trash2} from "lucide-react";

interface Customer {
    id: number;
    status: boolean;
    firstName: string;
    lastName: string;
    city: string;
    postalCode: string;
    telephone: string;
    email: string;
}

interface Props {
    customers: Customer[];
}

const Index = ({
    customers
}: Props) => {

    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<Customer | null>(null);

    const columns: BaseColumn<Customer>[] = [
        {
            key: 'lastName',
            title: 'Last Name',
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'search...',
            },
            sortable: true
        },
        {
            key: 'firstName',
            title: 'First Name',
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'search...',
            },
            sortable: true
        },
        {
            key: 'email',
            title: 'Email',
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'search...',
            },
            sortable: true
        },
        {
            key: 'telephone',
            title: 'Telephone',
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'search...',
            },
            sortable: true
        },
        {
            key: 'city',
            title: 'City',
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'search...',
            },
            sortable: true
        },
        {
            key: 'postalCode',
            title: 'Postal Code',
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'search...',
            },
            sortable: true
        },
        {
            key: 'status',
            title: 'Status',
            type: 'status',
            config: {
                status: {
                    'true': { label: "Active", className: "text-green-800 bg-green-100" },
                    'false': { label: "Inactive", className: "text-gray-800 bg-red-100" },
                }
            }
        }
    ];

    const handleCreate = () => {
        router.get('/vendor/customer/create');
    };

    const handleEdit = (customer: Customer) => {
        router.get(`/vendor/customer/${customer.id}/edit`);
    };

    const handleDelete = (customer: Customer) => {
        setRecordToDelete(customer);
        setDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (recordToDelete) {
            router.delete(`/vendor/customer/${recordToDelete.id}`);
        }
    };

    const actionsRoot = [
        { label: "Register Customer", icon: Plus, onClick: handleCreate }
    ];

    const actions: Action<Customer>[] = [
        { label: 'Edit Customer', icon: Pencil, onClick: handleEdit, variant: 'secondary' },
        { label: 'Delete Customer', icon: Trash2, onClick: handleDelete, variant: 'danger' }
    ];

    return (
        <VendorLayout>
            <Head title="Customers" />
            <PageLayout
                title="Customers"
                actions={actionsRoot}
                fullWidth={true}
            >
                <ClientDataTable
                    columns={columns}
                    data={customers}
                    actions={actions}
                />

                <ConfirmationDialog
                    isOpen={deleteConfirm}
                    onClose={() => {
                        setDeleteConfirm(false);
                        setRecordToDelete(null);
                    }}
                    onConfirm={confirmDelete}
                    title='Delete Customer'
                    message={`Are you sure you want to delete customer ${recordToDelete?.lastName}? This action cannot be undone.`}
                    confirmText='Delete'
                    type='danger'
                />
            </PageLayout>
        </VendorLayout>
    );
};

export default Index;
