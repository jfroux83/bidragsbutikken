import {Head, router} from "@inertiajs/react";
import OrganizationLayout from "@/Layouts/OrganizationLayout";
import PageLayout from "@/Components/UI/PageLayout";
import {ClientDataTable} from "@/Components/DataTable/ClientDataTable";
import {BaseColumn} from "@/Components/DataTable/DataTable";
import {Plus} from "lucide-react";
import React from "react";

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

    const columns: BaseColumn<Customer>[] = [
        {
            key: 'firstName',
            title: 'First Name',
        }
    ];

    const handleCreate = () => {
        router.get('/organization/customer/create');
    };

    const actionsRoot = [
        { label: "Register Customer", icon: Plus, onClick: handleCreate }
    ];

    const actions = [];

    return (
        <OrganizationLayout>
            <Head title="Customers" />
            <PageLayout
                title="Customers"
                actions={actionsRoot}
            >
                <ClientDataTable
                    columns={columns}
                    data={customers}
                />
            </PageLayout>
        </OrganizationLayout>
    );
};

export default Index;
