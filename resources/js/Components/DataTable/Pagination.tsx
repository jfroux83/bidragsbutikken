interface Props {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({
    currentPage,
    totalItems,
    pageSize,
    onPageChange
}: Props) => {

    const totalPages = Math.ceil(totalItems / pageSize);

    const getPageNumbers = () => {
        let pages: number[] = [];
        const maxPagesShown = 5;

        if (totalPages <= maxPagesShown) {
            pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, startPage + maxPagesShown - 1);
            pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
                        currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
                        currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">
                            {Math.min((currentPage - 1) * pageSize + 1, totalItems)}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium">
                            {Math.min(currentPage * pageSize, totalItems)}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium">{totalItems}</span> results
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        {/* Add First Page button */}
                        <button
                            onClick={() => onPageChange(1)}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-500 hover:bg-gray-50 focus:z-20'
                            } border border-gray-300 rounded-l-md`}
                        >
                            First
                        </button>

                        {getPageNumbers().map((page) => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                    currentPage === page
                                        ? 'z-10 bg-[#508ABE] text-white focus:z-20'
                                        : 'bg-white text-gray-500 hover:bg-gray-50 focus:z-20'
                                } border border-gray-300`}
                            >
                                {page}
                            </button>
                        ))}

                        {/* Add Last Page button */}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-500 hover:bg-gray-50 focus:z-20'
                            } border border-gray-300 rounded-r-md`}
                        >
                            Last
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default Pagination;
