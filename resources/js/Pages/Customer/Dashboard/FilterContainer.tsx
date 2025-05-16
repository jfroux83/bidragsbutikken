import {FilterOption} from "@/Pages/Customer/types";

interface Props {
    categories: FilterOption[];
    tags: FilterOption[];
}

const FilterContainer = ({
    categories,
    tags
}: Props) => {

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Filters</h2>

            <div className="space-y-6">
                {/* Categories Filter */}
                <div className="border-b pb-4">
                    <h3 className="font-medium mb-2">Categories</h3>
                    {/* CategoryFilter component will be placed here */}
                    <div className="placeholder-for-category-filter">
                        {/* CategoryFilter component */}
                    </div>
                </div>

                {/* Tags Filter */}
                <div>
                    <h3 className="font-medium mb-2">Tags</h3>
                    {/* TagFilter component will be placed here */}
                    <div className="placeholder-for-tag-filter">
                        {/* TagFilter component */}
                    </div>
                </div>

                {/* Clear Filters Button */}
                <div className="pt-4">
                    <button
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
                        onClick={() => {
                            // Clear filter logic will go here
                        }}
                    >
                        Clear All Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterContainer;
