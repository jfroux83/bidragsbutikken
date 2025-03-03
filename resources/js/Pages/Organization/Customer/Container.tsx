import {useState} from "react";
import {Head, router} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PageLayout from "@/Components/UI/PageLayout";
import {CornerDownLeft, Plus} from "lucide-react";
import Edit from "@/Pages/Organization/Customer/Edit";

type Tab = 'edit' | 'payment_methods' | 'shipping_addresses' | 'orders';

interface Props {
    customer: {
        id: number;
        status: boolean;
        firstName: string;
        lastName: string;
        street1: string;
        street2: string;
        city: string;
        postalCode: string;
        telephone: string;
        email: string;
        referredBy: string;
    };
    postalCodes: Array<{
        label: string;
        value: string;
    }>;
}

const Container = ({
    customer,
    postalCodes,
}: Props) => {

    const [activeTab, setActiveTab] = useState<Tab>('edit');

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
    };

    const handleReturn = () => {
        router.get('/organization/customer');
    }

    const actionsRoot = [
        { label: "Return", icon: CornerDownLeft, onClick: handleReturn, variant: 'secondary' },
    ];

    return (
        <AdminLayout>
            <Head title="Customer | Edit" />
            <PageLayout
                title={`${customer.lastName}, ${customer.firstName} | Edit`}
                // @ts-ignore
                actions={actionsRoot}
                fullWidth={true}
            >
                <div className="flex h-[calc(100vh-20rem)] bg-gray-50">
                    <div className="w-64 border-r bg-white overflow-y-auto">
                        <nav className="flex flex-col p-4">
                            <button
                                className={`text-left px-4 py-3 rounded-lg mb-2 ${
                                    activeTab === 'edit'
                                        ? 'bg-green-50 text-green-600 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                onClick={() => handleTabChange('edit')}
                            >
                                Edit
                            </button>
                            <button
                                className={`text-left px-4 py-3 rounded-lg mb-2 ${
                                    activeTab === 'payment_methods'
                                        ? 'bg-green-50 text-green-600 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                onClick={() => handleTabChange('payment_methods')}
                            >
                                Payment Methods
                            </button>
                            <button
                                className={`text-left px-4 py-3 rounded-lg mb-2 ${
                                    activeTab === 'shipping_addresses'
                                        ? 'bg-green-50 text-green-600 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                onClick={() => handleTabChange('shipping_addresses')}
                            >
                                Shipping Addresses
                            </button>
                            <button
                                className={`text-left px-4 py-3 rounded-lg mb-2 ${
                                    activeTab === 'orders'
                                        ? 'bg-green-50 text-green-600 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                onClick={() => handleTabChange('orders')}
                            >
                                Orders
                            </button>
                        </nav>
                    </div>

                    <div className="flex-1 p-8 overflow-y-auto">
                        {activeTab === 'edit' && (
                            <div>
                                <h2 className="text-2xl font-medium mb-6">Edit</h2>
                                <Edit
                                    customer={customer}
                                    postalCodes={postalCodes}
                                />
                            </div>
                        )}
                        {activeTab === 'payment_methods' && (
                            <div>
                                <h2 className="text-2xl font-medium mb-6">Payment Methods</h2>

                            </div>
                        )}
                        {activeTab === 'shipping_addresses' && (
                            <div>
                                <h2 className="text-2xl font-medium mb-6">Shipping Addresses</h2>
                            </div>
                        )}
                        {activeTab === 'orders' && (
                            <div>
                                <h2 className="text-2xl font-medium mb-6">Orders</h2>
                            </div>
                        )}
                    </div>
                </div>
            </PageLayout>
        </AdminLayout>
    );
};

export default Container;
