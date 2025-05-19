import {useState} from "react";
import {FilterOption} from "@/Pages/Customer/types";
import {ChevronDown, ChevronUp} from "lucide-react";

interface Props {
    categories: FilterOption[];
    selectedCategories: number[];
    onCategoryChange: (categoryId: number) => void;
}

const FilterCategories = ({
    categories,
    selectedCategories,
    onCategoryChange
}: Props) => {

    const [showAll, setShowAll] = useState(false);

    const displayedCategories = showAll
        ? categories
        : categories.slice(0, 6);

    const hasMoreCategories = categories.length > 6;

    return (
        <div className="space-y-2">
            {displayedCategories.map((category) => (
                <div key={category.value} className="flex items-center">
                    <input
                        type="checkbox"
                        id={`category-${category.value}`}
                        checked={selectedCategories.includes(category.value)}
                        onChange={() => onCategoryChange(category.value)}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label
                        htmlFor={`category-${category.value}`}
                        className="ml-2 text-sm text-gray-700"
                    >
                        {category.label}
                    </label>
                </div>
            ))}

            {hasMoreCategories && (
                <button
                    type="button"
                    className="mt-2 flex items-center text-sm text-green-600 hover:text-green-800"
                    onClick={() => setShowAll(!showAll)}
                >
                    {showAll ? (
                        <>
                            <ChevronUp className="mr-1 h-4 w-4" />
                            Show Less
                        </>
                    ) : (
                        <>
                            <ChevronDown className="mr-1 h-4 w-4" />
                            Show More ({categories.length - 6} more)
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

export default FilterCategories;
