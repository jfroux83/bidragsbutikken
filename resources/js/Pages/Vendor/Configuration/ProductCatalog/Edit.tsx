import {Head, router} from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import PageLayout from "@/Components/UI/PageLayout";
import {ClientDataTable} from "@/Components/DataTable/ClientDataTable";
import {Action, BaseColumn} from "@/Components/DataTable/DataTable";
import {CornerDownLeft, Edit2} from "lucide-react";

interface Product {
    id: number;
    name: string;
    categories: {
        name: string;
    }[];
    tags: {
        name: string;
    }[];
}

interface SourceVendor {
    id: number;
    name: string;
}

interface Price {
    id: number;
    product_variation_id: number;
    type: string;
    status: boolean;
    price: number;
}

interface Props {
    product: Product;
    source_vendor: SourceVendor;
    prices: Price[];
}

const Edit = ({
    product,
    source_vendor,
    prices
}: Props) => {

    const columns: BaseColumn<Price>[] = [
        {
            key: 'type',
            title: 'Type',
        },
        {
            key: 'status',
            title: 'Status',
            type: 'status',
            config: {
                status: {
                    'true': { label: 'Active', className: 'text-green-800 bg-green-100' },
                    'false': { label: 'Inactive', className: 'text-gray-800 bg-red-100' },
                }
            }
        },
        {
            key: 'product_variation_id',
            title: 'Variation ID',
        },
        {
            key: 'price',
            title: 'Price',
        }
    ];

    const handleReturn = () => {
        router.get('/vendor/product/catalog');
    };

    const actionsRoot = [
        { icon: CornerDownLeft, label: 'Return to Product Catalog', onClick: handleReturn, variant: 'secondary' }
    ];

    const handleEditPrice = (price: Price) => {
        router.get(`/vendor/product/catalog/product/price/${price.id}/edit`);
    };

    const actions: Action<Price>[] = [
        { icon: Edit2, label: 'Edit Price', onClick: handleEditPrice, variant: 'secondary' }
    ];

    return (
        <VendorLayout>
            <Head title="Product Catalog | Prices" />
            <PageLayout
                title={`Product Catalog | Prices | ${product.name}`}
                // @ts-ignore
                actions={actionsRoot}
            >
                {/* Categories section */}
                {product.categories && product.categories.length > 0 && (
                    <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-500">Categories</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {product.categories.map((category, index) => (
                                <span
                                    key={index}
                                    className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                                >
                                    {category.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tags section */}
                {product.tags && product.tags.length > 0 && (
                    <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-500">Tags</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {product.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <h4 className="text-sm font-medium text-gray-500 my-2">Pricing</h4>

                <ClientDataTable
                    columns={columns}
                    data={prices}
                    actions={actions}
                />
            </PageLayout>
        </VendorLayout>
    );
};

export default Edit;
