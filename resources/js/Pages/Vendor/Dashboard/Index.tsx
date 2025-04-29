import {Head} from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import PageLayout from "@/Components/UI/PageLayout";

const Index = () => {

    return (
        <VendorLayout>
            <Head title="Vendor" />
            <PageLayout
                title="Vendor Dashboard"
                containerClassName="bg-white shadow rounded-md mt-2"
            >
                <div>Welcome to the Vendor Dashboard</div>
            </PageLayout>
        </VendorLayout>
    );
};

export default Index;
