import {router} from "@inertiajs/react";
import {ClientDataTable} from "@/Components/DataTable/ClientDataTable";
import {Action, BaseColumn} from "@/Components/DataTable/DataTable";
import {ToggleRight} from "lucide-react";

interface Product {
    id: number;
    vendor_name: string;
    product_name: string;
    status: boolean;
}

interface Props {
    products: Product[];
}

const Products = ({ products }: Props) => {

    const columns: BaseColumn<Product>[] = [
        {
            key: 'vendor_name',
            title: 'Vendor',
        },
        {
            key: 'product_name',
            title: 'Product',
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
        }
    ];

    const handleToggleStatus = (product: Product) => {
        router.get(`/admin/organization/product/${product.id}/toggle-status`);
    };

    const actions: Action<Product>[] = [
        { icon: ToggleRight, label: 'Toggle Status', onClick: handleToggleStatus, variant: 'primary' },
    ];

    return (
        <div className="w-full">
            <ClientDataTable
                columns={columns}
                data={products}
                actions={actions}
            />
        </div>
    );
};

export default Products;
