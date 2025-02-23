import {useState} from "react";
import {Head, router} from "@inertiajs/react";
import {CornerDownLeft} from "lucide-react";
import PageLayout from "@/Components/UI/PageLayout";
import Edit from "@/Pages/Admin/Vendor/Edit";
import Users from "@/Pages/Admin/Vendor/Users";
import AdminLayout from "@/Layouts/AdminLayout";

type Tab = 'edit' | 'payment_methods' | 'users';

interface Props {
    vendor: {
        id: number;
        status: boolean;
        name: string;
        address1: string;
        address2: string;
        city: string;
        postalCode: string;
        telephone: string;
        email: string;
        receiveOrdersEmail: boolean;
        freeShippingAmount: number;
        adminFee: number;
        paymentFee: number;
        systemFee: number;
        contributionFee: number;
        bonusFee: number;
        maxDeliveryDistance: number;
    };
    postalCodes: Array<{
        label: string;
        value: string;
    }>
}

const Container = ({
    vendor,
    postalCodes
}: Props) => {

    const [activeTab, setActiveTab] = useState<Tab>('edit');

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
    };

    const handleReturn = () => {
        router.get('/admin/vendor');
    }

    const actionsRoot = [
        { label: "Return", icon: CornerDownLeft, onClick: handleReturn, variant: 'secondary' },
    ];

    return (
        <AdminLayout>
            <Head title="Admin | Vendors" />
            <PageLayout
                title="Vendor | Edit"
                // containerClassName="bg-white shadow rounded-md mt-2"
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
                                    activeTab === 'users'
                                        ? 'bg-green-50 text-green-600 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                onClick={() => handleTabChange('users')}
                            >
                                Users
                            </button>
                        </nav>
                    </div>

                    <div className="flex-1 p-8 overflow-y-auto">
                        {activeTab === 'edit' && (
                            <div>
                                <h2 className="text-2xl font-medium mb-6">Edit</h2>
                                <Edit
                                    vendor={vendor}
                                    postalCodes={postalCodes}
                                />
                            </div>
                        )}
                        {activeTab === 'payment_methods' && (
                            <div>
                                <h2 className="text-2xl font-medium mb-6">Payment Methods</h2>

                            </div>
                        )}
                        {activeTab === 'users' && (
                            <div>
                                <h2 className="text-2xl font-medium mb-6">Users</h2>
                                <Users vendorId={vendor.id} />
                            </div>
                        )}
                    </div>
                </div>
            </PageLayout>
        </AdminLayout>
    );
};

export default Container;
