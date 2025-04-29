// TODO: implement create (route, controller methods, Create page)
// TODO: implement edit (route, controller methods, Edit page)
// TODO: implement delete (route, controller method, Index page)

import {Head} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PageLayout from "@/Components/UI/PageLayout";
import {ClientDataTable} from "@/Components/DataTable/ClientDataTable";
import {BaseColumn} from "@/Components/DataTable/DataTable";

interface Tag {
    id: number;
    vendor_id: number;
    vendor_name: string;
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
            key: 'vendor_name',
            title: 'Vendor',
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'search...',
            },
            sortable: true
        },
        {
            key: 'name',
            title: 'Name',
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'search...',
            },
            sortable: true
        }
    ];

    return (
        <AdminLayout>
            <Head title="Product Tags" />
            <PageLayout
                title="Product Tags"
            >
                <ClientDataTable
                    columns={columns}
                    data={tags}
                />
            </PageLayout>
        </AdminLayout>
    );
};

export default Index;
