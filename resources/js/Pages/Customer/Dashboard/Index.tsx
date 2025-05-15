import {Head} from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import Products from "@/Pages/Customer/Dashboard/Products";
import {Product} from "@/Pages/Customer/types";

interface Props {
    products: Product[]
}

const Index = ({
    products,
}: Props) => {

    return (
        <CustomerLayout>
            <Head title="Customer Dashboard" />

            <div className="w-full" style={{ height: 'calc(100vh - 180px)' }}>
                {/* Main container with explicit height calculation to account for footer */}
                <div className="h-full flex flex-col md:flex-row overflow-hidden">
                    {/* Filters Column - scrollable */}
                    <div className="w-full md:w-1/4 border-2 border-blue-500 p-4 overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Filters</h2>
                        <div className="space-y-4">
                            {/* Filter components will go here */}
                            <p className="text-gray-500">Filter options will be added here</p>

                            {/* Adding dummy content to demonstrate scrolling */}
                            {/*{Array(20).fill(0).map((_, index) => (*/}
                            {/*    <div key={index} className="py-2 border-b border-gray-200">*/}
                            {/*        Filter option {index + 1}*/}
                            {/*    </div>*/}
                            {/*))}*/}
                        </div>
                    </div>

                    {/* Products Column - scrollable */}
                    <div className="w-full md:w-3/4 border-2 border-green-500 p-4 overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Products products={products} />
                        </div>
                    </div>
                </div>
            </div>

        </CustomerLayout>
    );
};

export default Index;
