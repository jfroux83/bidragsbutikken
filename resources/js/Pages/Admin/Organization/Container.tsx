import {useState} from "react";
import {Head, router} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PageLayout from "@/Components/UI/PageLayout";
import Edit from "@/Pages/Admin/Organization/Edit";
import {CornerDownLeft, Plus} from "lucide-react";

type Tab = 'edit' | 'payment_methods' | 'vendors' | 'users';

interface Props {
    organization: {
        id: number;
        status: boolean;
        name: string;
        registrationNumber: string;
        address1: string;
        address2: string;
        city: string;
        postalCode: string;
        telephone: string;
        email: string;
        logo: string;
    };
    postalCodes: Array<{
        label: string;
        value: string;
    }>;
}

const Container = ({
    organization,
    postalCodes,
}: Props) => {

    const [activeTab, setActiveTab] = useState<Tab>('edit');

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
    };

    const handleReturn = () => {
        router.get('/admin/organization');
    }

    const actionsRoot = [
        { label: "Return", icon: CornerDownLeft, onClick: handleReturn },
    ];

    return (
        <AdminLayout>
            <Head title="Admin | Organization" />
            <PageLayout
                title="Organization | Edit"
                containerClassName="bg-white shadow rounded-md mt-2"
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
                                    activeTab === 'vendors'
                                        ? 'bg-green-50 text-green-600 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                onClick={() => handleTabChange('vendors')}
                            >
                                Vendors
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
                                    organization={organization}
                                    postalCodes={postalCodes}
                                />
                            </div>
                        )}
                        {activeTab === 'payment_methods' && (
                            <div>
                                <h2 className="text-2xl font-medium mb-6">Payment Methods</h2>

                            </div>
                        )}
                        {activeTab === 'vendors' && (
                            <div>
                                <h2 className="text-2xl font-medium mb-6">Vendors</h2>

                            </div>
                        )}
                        {activeTab === 'users' && (
                            <div>
                                <h2 className="text-2xl font-medium mb-6">Users</h2>

                            </div>
                        )}
                    </div>
                </div>
            </PageLayout>
        </AdminLayout>
    );
};

export default Container;
