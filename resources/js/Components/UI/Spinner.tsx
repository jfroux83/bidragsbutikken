import React from 'react';

const Spinner = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            {/* Spinner */}
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            {/* Loading text */}
            <p className="mt-2 text-gray-600">Loading data...</p>
        </div>
    );
};

export default Spinner;
