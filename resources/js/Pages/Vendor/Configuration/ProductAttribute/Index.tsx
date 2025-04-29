import {Head} from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import PageLayout from "@/Components/UI/PageLayout";
import AttributeManager from "@/Components/ProductAttributes/AttributeManager";
import {Attribute} from "@/Components/ProductAttributes/types";

interface Props {
    attributes: Attribute[];
}

const Index = ({ attributes }: Props) => {

    return (
        <VendorLayout>
            <Head title="Product Attributes" />
            <PageLayout
                title="Product Attributes"
            >
                <AttributeManager initialAttributes={attributes} />
            </PageLayout>
        </VendorLayout>
    )
};

export default Index;
