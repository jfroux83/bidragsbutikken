import {Head, router} from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import PageLayout from "@/Components/UI/PageLayout";
import Card from "@/Components/Card/Card";
import CardHeader from "@/Components/Card/CardHeader";
import CardTitle from "@/Components/Card/CardTitle";
import CardContent from "@/Components/Card/CardContent";
import {CornerDownLeft, Mail, MapPin, Phone} from "lucide-react";

interface Vendor {
    id: number;
    name: string;
    telephone: string;
    email: string;
    address_1: string;
    address_2: string;
    city: string;
    postal_code: string;
}

interface Props {
    vendors: Vendor[];
}

const Vendors = ({ vendors }: Props) => {

    const handleReturn = () => {
        router.get('/vendor/product/catalog');
    };

    const actionsRoot = [
        { icon: CornerDownLeft, label: 'Return to Product Catalog', onClick: handleReturn, variant: 'secondary', size: 'sm' }
    ];

    return (
        <VendorLayout>
            <Head title="Product Catalog | Vendors" />
            <PageLayout
                title="Product Catalog | Vendors"
                // @ts-ignore
                actions={actionsRoot}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vendors.map((vendor) => (
                        <Card key={vendor.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle>{vendor.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {/* Existing content with phone, email, address */}
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span>{vendor.telephone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        <a href={`mailto:${vendor.email}`} className="text-green-600 hover:underline">
                                            {vendor.email}
                                        </a>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                                        <div>
                                            <div>{vendor.address_1}</div>
                                            {vendor.address_2 && <div>{vendor.address_2}</div>}
                                            <div>{vendor.city}, {vendor.postal_code}</div>
                                        </div>
                                    </div>

                                    {/* New button addition */}
                                    <div className="pt-2">
                                        <button
                                            onClick={() => router.get(`/vendor/product/catalog/vendor/${vendor.id}/products`)}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-colors"
                                        >
                                            Show Products
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </PageLayout>
        </VendorLayout>
    );
};

export default Vendors;
