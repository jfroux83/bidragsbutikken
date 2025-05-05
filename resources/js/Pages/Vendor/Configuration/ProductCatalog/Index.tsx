import {Head, router} from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import PageLayout from "@/Components/UI/PageLayout";
import {ClientDataTable} from "@/Components/DataTable/ClientDataTable";
import {Action, BaseColumn} from "@/Components/DataTable/DataTable";
import {Building, Info} from "lucide-react";

interface ProductCatalog {
    id: number;
    source_vendor_id: number;
    source_vendor_name: string;
    product_id: number;
    product_name: string;
}

interface Props {
    products: ProductCatalog[];
}

const Index = ({ products }: Props) => {

    const columns: BaseColumn<ProductCatalog>[] = [
        {
            key: 'product_name',
            title: 'Product Name',
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'search...',
            },
            sortable: true
        },
        {
            key: 'source_vendor_name',
            title: 'Source Vendor',
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'search...',
            },
            sortable: true
        }
    ];

    const handleVendors = () => {
        router.get('/vendor/product/catalog/vendors')
    };

    const handleProductInfo = (product: ProductCatalog) => {
        router.get(`/vendor/product/catalog/${product.source_vendor_id}/${product.product_id}/edit`);
    };

    const actionsRoot = [
        { icon: Building, label: "Browse Vendors", onClick: handleVendors, variant: "secondary" }
    ];

    const actions: Action<ProductCatalog>[] = [
        { icon: Info, label: 'Show Product Information', onClick: handleProductInfo, variant: 'secondary' },
    ]

    return (
        <VendorLayout>
            <Head title="Product Catalog" />
            <PageLayout
                title="Product Catalog"
                // @ts-ignore
                actions={actionsRoot}
            >
                <ClientDataTable
                    columns={columns}
                    data={products}
                    actions={actions}
                />
            </PageLayout>
        </VendorLayout>
    );
};

export default Index;
