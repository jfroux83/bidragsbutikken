import React, {useState} from "react";
import {Head, router} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PageLayout from "@/Components/UI/PageLayout";
import {ClientDataTable} from "@/Components/DataTable/ClientDataTable";
import {Action} from "@/Components/DataTable/DataTable";
import {Edit, Plus} from "lucide-react";

interface Organization {
    id: number;
    status: boolean;
    name: string;
    registrationNumber: string;
    address1: string;
    address2: string;
    city: string;
    postalCode: string;
    telephone: string;
    email: string;
}

interface Props {
    organizations: Organization[];
}

const Index = ({
    organizations: initialData
}: Props) => {

    const [filteredData, setFilteredData] = useState(initialData);

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
        router.get('/admin/organization/create');
    };

    const handleEdit = (row: Organization) => {
        router.get(`/admin/organization/${row.id}/edit`);
    };

    const actions: Action<Organization>[] = [
        { label: 'Edit Organization', icon: Edit, onClick: handleEdit, variant: 'secondary' }
    ];

    const actionsRoot = [
        { label: "Create New Organization", icon: Plus, onClick: handleCreate },
    ];

    return (
        <AdminLayout>
            <Head title="Admin | Organizations" />
            <PageLayout
                title="Organizations"
                containerClassName="bg-white shadow rounded-md mt-2"
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
            </PageLayout>
        </AdminLayout>
    );
};

export default Index;
