import {Head} from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import PageLayout from "@/Components/UI/PageLayout";
import AttributeList from "@/Components/ProductAttributes/AttributeList";

const Index = () => {

    return (
        <VendorLayout>
            <Head title="Product Attributes" />
            <PageLayout
                title="Product Attributes"
            >
                <AttributeList attributes={[]} />
            </PageLayout>
        </VendorLayout>
    )
};

export default Index;
