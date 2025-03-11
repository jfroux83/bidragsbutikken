// TODO: implement edit (controller methods, Edit page)
// TODO: implement delete (controller method, Index page)

import {Head, router} from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import PageLayout from "@/Components/UI/PageLayout";
import {ClientDataTable} from "@/Components/DataTable/ClientDataTable";
import {BaseColumn} from "@/Components/DataTable/DataTable";
import {Plus} from "lucide-react";

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

    const columns: BaseColumn<Tag>[] = [
        {
            key: 'name',
            title: 'Name',
        }
    ];

    const handleCreate = () => {
        router.get('/vendor/product/tag/create');
    };

    const actionsRoot = [
        { icon: Plus, label: 'Create new Product Tag', onClick: handleCreate }
    ];

    const actions = [];

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
            </PageLayout>
        </VendorLayout>
    );
};

export default Index;
