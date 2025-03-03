import React, {useState} from "react";
import {Head, router} from "@inertiajs/react";
import {Action} from "@/Components/DataTable/DataTable";
import {Edit, Plus, Trash2} from "lucide-react";
import PageLayout from "@/Components/UI/PageLayout";
import {ClientDataTable} from "@/Components/DataTable/ClientDataTable";
import ConfirmationDialog from "@/Components/UI/ConfirmationDialog";
import AdminLayout from "@/Layouts/AdminLayout";

interface Vendor {
    id: number;
    status: boolean;
    name: string;
    address1: string;
    address2: string;
    city: string;
    postalCode: string;
    telephone: string;
    email: string;
}

interface Props {
    vendors: Vendor[];
}

const Index = ({
    vendors: initialData
}: Props) => {

    const [filteredData, setFilteredData] = useState(initialData);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<Vendor | null>(null);

    const columns = [
        {
            key: "name",
            title: "Name",
            filterable: true,
            filterConfig: {
                type: "text",
                placeholder: "search..."
            },
            sortable: true,
        },
        {
            key: "telephone",
            title: "Telephone",
            filterable: true,
            filterConfig: {
                type: "text",
                placeholder: "search..."
            },
            sortable: true,
            formatter: (value: string) => (
                <span>{`+47${value}`}</span>
            )
        },
        {
            key: "email",
            title: "Email",
            filterable: true,
            filterConfig: {
                type: "text",
                placeholder: "search..."
            },
            sortable: true,
        },
        {
            key: "city",
            title: "City",
            filterable: true,
            filterConfig: {
                type: "text",
                placeholder: "search..."
            },
            sortable: true,
        },
        {
            key: "postalCode",
            title: "Postal Code",
            filterable: true,
            filterConfig: {
                type: "text",
                placeholder: "search..."
            },
            sortable: true,
        },
        {
            key: "status",
            title: "Status",
            type: 'status',
            config: {
                status: {
                    'true': { label: "Active", className: "text-green-800 bg-green-100" },
                    'false': { label: "Inactive", className: "text-gray-800 bg-red-100" },
                }
            }
        }
    ];

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/vendor/create');
    };

    const handleEdit = (row: Vendor) => {
        router.get(`/admin/vendor/${row.id}/edit`);
    };

    const handleDelete = (row: Vendor) => {
        setRecordToDelete(row);
        setDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (recordToDelete) {
            router.delete(`/admin/vendor/${recordToDelete.id}`);
        }
    };

    const actions: Action<Vendor>[] = [
        { label: 'Edit Vendor', icon: Edit, onClick: handleEdit, variant: 'secondary' },
        { label: 'Delete Vendor', icon: Trash2, onClick: handleDelete, variant: 'danger' }
    ];

    const actionsRoot = [
        { label: "Create New Vendor", icon: Plus, onClick: handleCreate },
    ];

    return (
        <AdminLayout>
            <Head title="Admin | Vendors" />
            <PageLayout
                title="Vendors"
                // containerClassName="bg-white shadow rounded-md mt-2"
                // @ts-ignore
                actions={actionsRoot}
                fullWidth={true}
            >
                <ClientDataTable
                    // @ts-ignore
                    columns={columns}
                    data={initialData}
                    actions={actions}
                />

                <ConfirmationDialog
                    isOpen={deleteConfirm}
                    onClose={() => {
                        setDeleteConfirm(false);
                        setRecordToDelete(null);
                    }}
                    onConfirm={confirmDelete}
                    title='Delete Vendor'
                    message={`Are you sure you want to delete vendor ${recordToDelete?.name}? This action cannot be undone.`}
                    confirmText='Delete'
                    type='danger'
                />
            </PageLayout>
        </AdminLayout>
    );
};

export default Index;
