// TODO: implement edit
// TODO: implement delete

import React, {useState} from "react";
import {Head, router} from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import PageLayout from "@/Components/UI/PageLayout";
import {ClientDataTable} from "@/Components/DataTable/ClientDataTable";
import {Action, BaseColumn} from "@/Components/DataTable/DataTable";
import {Edit, Plus, Trash2} from "lucide-react";

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
}

const Index = ({
    categories
}: Props) => {

    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
    const [recordToDelete, setRecordToDelete] = useState<Category | null>(null);

    const columns: BaseColumn<Category>[] = [
        {
            key: 'name',
            title: 'Name',
        }
    ];

    const handleCreate = () => {
        router.get('/vendor/product/category/create');
    };

    const handleEdit = (category: Category) => {
        router.get(`/vendor/product/category/${category.id}/edit`);
    };

    const handleDelete = (category: Category) => {
        setRecordToDelete(category);
        setDeleteConfirm(true);
    };

    const actionsRoot = [
        { icon: Plus, label: 'Create Product Category', onClick: handleCreate }
    ];

    const actions: Action<Category>[] = [
        { icon: Edit, label: 'Edit Product Category', onClick: handleEdit, variant: 'secondary' },
        { icon: Trash2, label: 'Delete Product Category', onClick: handleDelete, variant: 'danger' }
    ];

    return (
        <VendorLayout>
            <Head title="Product Categories" />
            <PageLayout
                title="Product Categories"
                actions={actionsRoot}
            >
                <ClientDataTable
                    columns={columns}
                    data={categories}
                    actions={actions}
                />
            </PageLayout>
        </VendorLayout>
    );
};

export default Index;
