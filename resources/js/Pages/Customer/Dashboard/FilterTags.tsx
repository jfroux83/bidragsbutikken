import {useState} from "react";
import {FilterOption} from "@/Pages/Customer/types";
import {ChevronDown, ChevronUp} from "lucide-react";

interface Props {
    tags: FilterOption[];
    selectedTags: number[];
    onTagChange: (tagId: number) => void;
}

const FilterTags = ({
    tags,
    selectedTags,
    onTagChange
}: Props) => {

    const [showAll, setShowAll] = useState(false);

    const displayedTags = showAll
        ? tags
        : tags.slice(0, 6);

    const hasMoreTags = tags.length > 6;

    return (
        <div className="space-y-2">
            {displayedTags.map((tag) => (
                <div key={tag.value} className="flex items-center">
                    <input
                        type="checkbox"
                        id={`tag-${tag.value}`}
                        checked={selectedTags.includes(tag.value)}
                        onChange={() => onTagChange(tag.value)}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label
                        htmlFor={`tag-${tag.value}`}
                        className="ml-2 text-sm text-gray-700"
                    >
                        {tag.label}
                    </label>
                </div>
            ))}

            {hasMoreTags && (
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
                            Show More ({tags.length - 6} more)
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

export default FilterTags;
