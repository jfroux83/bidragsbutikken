import {useState} from "react";
import FilterSearchInput from "@/Pages/Customer/Dashboard/FilterSearchInput";
import FilterCategories from "@/Pages/Customer/Dashboard/FilterCategories";
import FilterTags from "@/Pages/Customer/Dashboard/FilterTags";
import {FilterOption} from "@/Pages/Customer/types";

interface Props {
    categories: FilterOption[];
    tags: FilterOption[];
    onCategoryChange: (categoryIds: number[]) => void;
    onTagChange: (tagIds: number[]) => void;
    onClearFilters: () => void;
    onSearch: (query: string) => void;
}

const FilterContainer = ({
    categories,
    tags,
    onCategoryChange,
    onTagChange,
    onClearFilters,
    onSearch,
}: Props) => {

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        onSearch(query);
    };

    const handleCategoryChange = (categoryId: number) => {
        const updatedCategories = selectedCategories.includes(categoryId)
            ? selectedCategories.filter(id => id !== categoryId)
            : [...selectedCategories, categoryId];

        setSelectedCategories(updatedCategories);
        onCategoryChange(updatedCategories);
    };

    const handleTagChange = (tagId: number) => {
        const updatedTags = selectedTags.includes(tagId)
            ? selectedTags.filter(id => id !== tagId)
            : [...selectedTags, tagId];

        setSelectedTags(updatedTags);
        onTagChange(updatedTags);
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedCategories([]);
        setSelectedTags([]);
        onSearch("");
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Filters</h2>

            {/* Search Input */}
            <FilterSearchInput
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
            />

            <div className="space-y-6">
                {/* Categories Filter */}
                <div className="border-b pb-4">
                    <h3 className="font-medium mb-2">Categories</h3>
                    {/* CategoryFilter component will be placed here */}
                    <FilterCategories
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onCategoryChange={handleCategoryChange}
                    />
                </div>

                {/* Tags Filter */}
                <div>
                    <h3 className="font-medium mb-2">Tags</h3>
                    {/* TagFilter component will be placed here */}
                    <FilterTags
                        tags={tags}
                        selectedTags={selectedTags}
                        onTagChange={handleTagChange}
                    />
                </div>

                {/* Clear Filters Button */}
                <div className="pt-4">
                    <button
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
                        onClick={() => {
                            handleClearFilters();
                            onClearFilters();
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
