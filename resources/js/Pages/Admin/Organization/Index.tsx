import {useState} from "react";
import {Head} from "@inertiajs/react";
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

    const columns = [];

    const handleCreate = () => {};

    const handleEdit = () => {};

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
                actions={actionsRoot}
                fullWidth={true}
            >
                <ClientDataTable
                    columns={columns}
                    data={initialData}
                    actions={actions}
                />
            </PageLayout>
        </AdminLayout>
    );
};

export default Index;
