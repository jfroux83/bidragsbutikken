import {useState} from "react";
import VendorLayout from "@/Layouts/VendorLayout";
import {Head, router} from "@inertiajs/react";
import PageLayout from "@/Components/UI/PageLayout";
import Card from "@/Components/Card/Card";
import CardHeader from "@/Components/Card/CardHeader";
import CardTitle from "@/Components/Card/CardTitle";
import CardContent from "@/Components/Card/CardContent";
import {Calendar, CornerDownLeft, DollarSign, Info, X} from "lucide-react";

interface Vendor {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    base_price: number;
    is_subscribable: boolean;
    categories: {
        name: string;
    }[];
    tags: {
        name: string;
    }[];
    variations: {
        id: number;
        sku: string;
        price: number;
    }[];
}

interface Props {
    vendor: Vendor;
    products: Product[];
}

const VendorProducts = ({
    vendor,
    products
}: Props) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [expandedDescriptions, setExpandedDescriptions] = useState<{[key: number]: boolean}>({});

    const handleReturn = () => {
        router.get('/vendor/product/catalog/vendors');
    };

    const handleAddToCatalog = (productId: number) => {
        router.post(`/vendor/product/catalog/add-product`, {
            source_vendor_id: vendor.id,
            product_id: productId
        });
    };

    const toggleDescription = (productId: number) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    const openModal = (product: Product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    const actionsRoot = [
        { icon: CornerDownLeft, label: 'Return to Vendors', onClick: handleReturn, variant: 'secondary', size: 'sm' }
    ];


    return (
        <VendorLayout>
            <Head title="Product Catalog | Vendor Products" />
            <PageLayout
                title={`Product Catalog | ${vendor.name} | Products`}
                // @ts-ignore
                actions={actionsRoot}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <Card key={product.id} className="hover:shadow-md transition-shadow relative">
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => openModal(product)}
                                    className="text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                    <Info className="w-5 h-5" />
                                </button>
                            </div>
                            <CardHeader>
                                <CardTitle>{product.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        {expandedDescriptions[product.id] ? (
                                            <p className="text-gray-600">
                                                {product.description}
                                                <button
                                                    onClick={() => toggleDescription(product.id)}
                                                    className="ml-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    Show less
                                                </button>
                                            </p>
                                        ) : (
                                            <p className="text-gray-600">
                                                {product.description.substring(0, 50)}
                                                {product.description.length > 50 && '...'}
                                                {product.description.length > 50 && (
                                                    <button
                                                        onClick={() => toggleDescription(product.id)}
                                                        className="ml-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        Show more
                                                    </button>
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-gray-500" />
                                        <span className="font-medium">
                                            {new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: 'USD'
                                            }).format(product.base_price)}
                                        </span>
                                    </div>

                                    {product.is_subscribable && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-600">Subscription available</span>
                                        </div>
                                    )}

                                    <div className="pt-2">
                                        <button
                                            onClick={() => handleAddToCatalog(product.id)}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-colors"
                                        >
                                            Add to Catalog
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No products available from this vendor.
                    </div>
                )}

                {/* Add Modal component at the end of your page layout */}
                {modalOpen && selectedProduct && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full p-6 mx-4 h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pt-1 pb-3 z-10 border-b">
                                <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Description</h4>
                                    <p className="mt-1">{selectedProduct.description}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Price</h4>
                                    <p className="mt-1 font-medium">
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD'
                                        }).format(selectedProduct.base_price)}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Subscription</h4>
                                    <p className="mt-1">
                                        {selectedProduct.is_subscribable ? 'Available' : 'Not available'}
                                    </p>
                                </div>

                                {/* Variations section */}
                                {selectedProduct.variations && selectedProduct.variations.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Variations</h4>
                                        <div className="mt-2 overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        SKU
                                                    </th>
                                                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Price
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                {selectedProduct.variations.map(variation => (
                                                    <tr key={variation.id}>
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                                                            {variation.sku}
                                                        </td>
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
                                                            {new Intl.NumberFormat('en-US', {
                                                                style: 'currency',
                                                                currency: 'USD'
                                                            }).format(variation.price)}
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Categories section */}
                                {selectedProduct.categories && selectedProduct.categories.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Categories</h4>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {selectedProduct.categories.map((category, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                                                >
                                    {category.name}
                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tags section */}
                                {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Tags</h4>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {selectedProduct.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                                                >
                                    {tag.name}
                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 sticky bottom-0 bg-white pt-4 border-t">
                                <button
                                    onClick={() => {
                                        handleAddToCatalog(selectedProduct.id);
                                        closeModal();
                                    }}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-colors"
                                >
                                    Add to Catalog
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </PageLayout>
        </VendorLayout>
    )
};

export default VendorProducts;
