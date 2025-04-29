// TODO: implement create (route, controller methods, Create page)
// TODO: implement edit (route, controller methods, Edit page)
// TODO: implement delete (route, controller method, Index page)

import {Head} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PageLayout from "@/Components/UI/PageLayout";
import {ClientDataTable} from "@/Components/DataTable/ClientDataTable";
import {BaseColumn} from "@/Components/DataTable/DataTable";

interface Category {
    id: number;
    vendor_id: number;
    vendor_name: string;
    name: string;
}

interface Props {
    categories: Category[];
}

const Index = ({
    categories
}: Props) => {

    const columns: BaseColumn<Category>[] = [
        {
            key: 'vendor_name',
            title: 'Vendor',
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'search...',
            },
            sortable: true,
        },
        {
            key: 'name',
            title: 'Name',
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'search...',
            },
            sortable: true,
        }
    ];

    const actionsRoot = [];

    const actions = [];

    return (
        <AdminLayout>
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
        </AdminLayout>
    );
};

export default Index;
