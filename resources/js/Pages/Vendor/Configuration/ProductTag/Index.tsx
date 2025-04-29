import {Head, router} from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import PageLayout from "@/Components/UI/PageLayout";
import {ClientDataTable} from "@/Components/DataTable/ClientDataTable";
import {Action, BaseColumn} from "@/Components/DataTable/DataTable";
import {Edit, Plus, Trash2} from "lucide-react";
import React, {useState} from "react";
import ConfirmationDialog from "@/Components/UI/ConfirmationDialog";

interface Tag {
    id: number;
    name: string;
}

interface Props {
    tags: Tag[];
}

const Index = ({
    tags
}: Props) => {

    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
    const [recordToDelete, setRecordToDelete] = useState<Tag | null>(null);

    const columns: BaseColumn<Tag>[] = [
        {
            key: 'name',
            title: 'Name',
        }
    ];

    const handleCreate = () => {
        router.get('/vendor/product/tag/create');
    };

    const handleEdit = (tag: Tag) => {
        router.get(`/vendor/product/tag/${tag.id}/edit`);
    };

    const handleDelete = (tag: Tag) => {
        setRecordToDelete(tag);
        setDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (recordToDelete) {
            router.delete(`/vendor/product/tag/${recordToDelete.id}`);
        }
    };

    const actionsRoot = [
        { icon: Plus, label: 'Create new Product Tag', onClick: handleCreate }
    ];

    const actions: Action<Tag>[] = [
        { icon: Edit, label: 'Edit Product Tag', onClick: handleEdit, variant: 'secondary' },
        { icon: Trash2, label: 'Delete Product Tag', onClick: handleDelete, variant: 'danger' }
    ];

    return (
        <VendorLayout>
            <Head title="Product Tags" />
            <PageLayout
                title="Product Tags"
                actions={actionsRoot}
            >
                <ClientDataTable
                    columns={columns}
                    data={tags}
                    actions={actions}
                />

                <ConfirmationDialog
                    isOpen={deleteConfirm}
                    onClose={() => {
                        setDeleteConfirm(false);
                        setRecordToDelete(null);
                    }}
                    onConfirm={confirmDelete}
                    title='Delete Product Tag'
                    message={`Are you sure you want to delete product tag ${recordToDelete?.name}? This action cannot be undone.`}
                    confirmText='Delete'
                    type='danger'
                />
            </PageLayout>
        </VendorLayout>
    );
};

export default Index;
