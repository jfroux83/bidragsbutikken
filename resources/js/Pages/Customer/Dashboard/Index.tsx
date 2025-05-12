import {Head} from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import PageLayout from "@/Components/UI/PageLayout";

const Index = () => {

    return (
        <CustomerLayout>
            <Head title="Customer Dashboard" />
            <PageLayout
                title="Customer Dashboard"
            >
                <div>Welcome to the Customer Dashboard</div>
            </PageLayout>
        </CustomerLayout>
    );
};

export default Index;
