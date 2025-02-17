import {Head} from "@inertiajs/react";
import OrganizationLayout from "@/Layouts/OrganizationLayout";
import PageLayout from "@/Components/UI/PageLayout";

const Index = () => {

    return (
        <OrganizationLayout>
            <Head title="Organization Dashboard" />
            <PageLayout
                title="Organization Dashboard"
                containerClassName="bg-white shadow rounded-md mt-2"
            >
                <div>Welcome to the Organization Dashboard</div>
            </PageLayout>
        </OrganizationLayout>
    );
};

export default Index;
