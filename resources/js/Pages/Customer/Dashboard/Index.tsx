import {Head} from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import Products from "@/Pages/Customer/Dashboard/Products";
import {FilterOption, Product} from "@/Pages/Customer/types";
import FilterContainer from "@/Pages/Customer/Dashboard/FilterContainer";

interface Props {
    products: Product[];
    categories: FilterOption[];
    tags: FilterOption[];
}

const Index = ({
    products,
    categories,
    tags
}: Props) => {

    return (
        <CustomerLayout>
            <Head title="Customer Dashboard" />

            <div className="w-full" style={{ height: 'calc(100vh - 180px)' }}>
                {/* Main container with explicit height calculation to account for footer */}
                <div className="h-full flex flex-col md:flex-row overflow-hidden">
                    {/* Filters Column - scrollable */}
                    <div className="w-full md:w-1/4 border-2 border-blue-500 p-4 overflow-y-auto">
                        {/*<h2 className="text-xl font-bold mb-4">Filters</h2>*/}
                        <div className="space-y-4">
                            <FilterContainer
                                categories={categories}
                                tags={tags}
                            />
                        </div>
                    </div>

                    {/* Products Column - scrollable */}
                    <div className="w-full md:w-3/4 border-2 border-green-500 p-4 overflow-y-auto">
                        {/*<h2 className="text-xl font-bold mb-4">Products</h2>*/}
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
