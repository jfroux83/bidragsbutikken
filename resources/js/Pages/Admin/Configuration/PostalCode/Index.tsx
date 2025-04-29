import React, {useState} from "react";
import {Head, router} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PageLayout from "@/Components/UI/PageLayout";
import {ClientDataTable} from "@/Components/DataTable/ClientDataTable";
import {FileDown, Paintbrush, Pencil, Plus, Trash2, Upload} from "lucide-react";
import {Action} from "@/Components/DataTable/DataTable";
import ConfirmationDialog from "@/Components/UI/ConfirmationDialog";

interface PostalCode {
    id: number;
    status: boolean;
    postalCode: string;
    city: string;
    latitude: string;
    longitude: string;
}

interface Props {
    postalCodes: PostalCode[];
}

const Index = ({
    postalCodes
}: Props) => {

    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<PostalCode | null>(null);
    const [wipeConfirm, setWipeConfirm] = useState(false);

    const columns = [
        {
            key: 'postalCode',
            title: 'Postal Code',
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'search...'
            },
            sortable: true,
        },
        {
            key: 'city',
            title: 'City',
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'search...'
            },
            sortable: true,
        },
        {
            key: 'latitude',
            title: 'Latitude',
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'search...'
            },
            sortable: true,
        },
        {
            key: 'longitude',
            title: 'Longitude',
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
            formatter: (value: boolean) => (
                <div className="flex justify-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-2xl shadow
                        ${value === true ? 'bg-green-200 text-green-600' : 'bg-red-200 text-red-600'}
                    `}>
                        {value === true ? 'Active' : 'Inactive' }
                    </span>
                </div>
            )
        }
    ];

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/configuration/postal-code/create');
    };

    const handleEdit = (row: PostalCode) => {
        router.get(`/admin/configuration/postal-code/${row.id}/edit`);
    };

    const handleDelete = (row: PostalCode) => {
        setRecordToDelete(row);
        setDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (recordToDelete) {
            router.delete(`/admin/configuration/postal-code/${recordToDelete.id}`);
        }
    };

    const handleDownloadTemplate = () => {
        window.location.href = '/admin/configuration/postal-code/download-template';
    };

    const handleUpload = (e: React.FormEvent) => {
          e.preventDefault();
          router.get('/admin/configuration/postal-code/upload');
    };

    const handleWipe = () => {
        setWipeConfirm(true);
    };

    const confirmWipe = () => {
        router.delete('/admin/configuration/postal-code/wipe');
    };

    const actionsRoot = [
        { label: 'Create New Record', icon: Plus, onClick: handleCreate, size: 'sm' },
        { label: 'Import Postal Codes', icon: Upload, onClick: handleUpload, variant: 'secondary', size: 'sm' },
        { label: 'Template: Postal Codes', icon: FileDown, onClick: handleDownloadTemplate, variant: 'secondary', size: 'sm' },
        { label: 'Wipe Postal Codes', icon: Paintbrush, onClick: handleWipe, variant: 'danger', size: 'sm' }
    ];

    const actions: Action<PostalCode>[] = [
        { label: 'Edit Record', icon: Pencil, onClick: handleEdit, variant: 'secondary' },
        { label: 'Delete Record', icon: Trash2, onClick: handleDelete, variant: 'danger' }
    ];

    return (
        <AdminLayout>
            <Head title="Config | Postal Codes" />
            <PageLayout
                title="Configuration | Postal Codes"
                containerClassName="bg-white shadow rounded-md mt-2"
                // @ts-ignore
                actions={actionsRoot}
            >
                <ClientDataTable
                    // @ts-ignore
                    columns={columns}
                    data={postalCodes}
                    actions={actions}
                />

                <ConfirmationDialog
                    isOpen={deleteConfirm}
                    onClose={() => {
                        setDeleteConfirm(false);
                        setRecordToDelete(null);
                    }}
                    onConfirm={confirmDelete}
                    title='Delete Postal Code'
                    message={`Are you sure you want to delete postal code ${recordToDelete?.postalCode}? This action cannot be undone.`}
                    confirmText='Delete'
                    type='danger'
                />

                <ConfirmationDialog
                    isOpen={wipeConfirm}
                    onClose={() => {
                        setWipeConfirm(false);
                    }}
                    onConfirm={confirmWipe}
                    title='Wipe Postal Codes'
                    message={`Are you sure you want to wipe postal codes? This action cannot be undone.`}
                    confirmText='Delete'
                    type='danger'
                />
            </PageLayout>
        </AdminLayout>
    );
};

export default Index;
