import React, {useState} from "react";
import {Search} from "lucide-react";

interface Props {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    onSearch: (query: string) => void;
}

const FilterSearchInput = ({
    searchQuery,
    setSearchQuery,
    onSearch,
}: Props) => {

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-gray-500" />
                </div>
                <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    className="absolute right-2.5 bottom-2.5 bg-green-600 hover:bg-green-700 text-white rounded-md px-3 py-1 text-sm"
                >
                    Search
                </button>
            </div>
        </form>
    );
};

export default FilterSearchInput;
