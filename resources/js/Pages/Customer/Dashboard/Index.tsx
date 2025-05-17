import {useEffect, useState} from "react";
import {Head} from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import Products from "@/Pages/Customer/Dashboard/Products";
import FilterContainer from "@/Pages/Customer/Dashboard/FilterContainer";
import {FilterOption, Product} from "@/Pages/Customer/types";

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

    // Add state for filtered products
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
    // Add state for selected filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);

    // Filter handler function
    const handleFilterChange = (categoryIds: number[], tagIds: number[], query: string) => {
        let filtered = products;

        // Filter by search query
        if (query.trim() !== "") {
            const searchLower = query.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchLower) ||
                product.tag_line.toLowerCase().includes(searchLower)
            );
        }

        // Filter by categories and tags
        if (categoryIds.length > 0 || tagIds.length > 0) {
            filtered = filtered.filter(product => {
                const matchesCategory = categoryIds.length === 0 ||
                    (product.categories && product.categories.some(id => categoryIds.includes(id)));

                const matchesTag = tagIds.length === 0 ||
                    (product.tags && product.tags.some(id => tagIds.includes(id)));

                return matchesCategory && matchesTag;
            });
        }

        setFilteredProducts(filtered);
    };

    // Effect to apply filters when selections change
    useEffect(() => {
        handleFilterChange(selectedCategories, selectedTags, searchQuery);
    }, [selectedCategories, selectedTags, searchQuery, products]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleClearFilters = () => {
        setSelectedCategories([]);
        setSelectedTags([]);
        setSearchQuery("");
        setFilteredProducts(products);
    };

    return (
        <CustomerLayout>
            <Head title="Customer Dashboard" />

            <div className="w-full" style={{ height: 'calc(100vh - 180px)' }}>
                {/* Main container with explicit height calculation to account for footer */}
                <div className="h-full flex flex-col md:flex-row overflow-hidden">
                    {/* Filters Column - scrollable */}
                    <div className="w-full md:w-1/4 p-4 overflow-y-auto">
                        {/*<h2 className="text-xl font-bold mb-4">Filters</h2>*/}
                        <div className="space-y-4">
                            <FilterContainer
                                categories={categories}
                                tags={tags}
                                onCategoryChange={setSelectedCategories}
                                onTagChange={setSelectedTags}
                                onClearFilters={handleClearFilters}
                                onSearch={handleSearch}
                            />
                        </div>
                    </div>

                    {/* Products Column - scrollable */}
                    <div className="w-full md:w-3/4 p-4 overflow-y-auto">
                        {/*<h2 className="text-xl font-bold mb-4">Products</h2>*/}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Products products={filteredProducts} />
                        </div>
                    </div>
                </div>
            </div>

        </CustomerLayout>
    );
};

export default Index;
