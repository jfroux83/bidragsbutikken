import {Head, router} from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import PageLayout from "@/Components/UI/PageLayout";
import {Building} from "lucide-react";

const Index = () => {

    const handleVendors = () => {
        router.get('/vendor/product/catalog/vendors')
    };

    const actionsRoot = [
        { icon: Building, label: "Browse Vendors", onClick: handleVendors, variant: "secondary" }
    ];

    return (
        <VendorLayout>
            <Head title="Product Catalog" />
            <PageLayout
                title="Product Catalog"
                // @ts-ignore
                actions={actionsRoot}
            >
                <div>List products in catalog</div>
            </PageLayout>
        </VendorLayout>
    );
};

export default Index;
