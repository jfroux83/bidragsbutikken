import {router} from "@inertiajs/react";

const Cancel = ({
    processing,
    route
}) => {

    const handleCancel = (e) => {
        e.preventDefault();
        router.get(route);
    }

    return (
        <button
            type="button"
            disabled={processing}
            onClick={handleCancel}
            className="px-4 py-2 text-gray-800 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
            Cancel
        </button>
    );
}

export default Cancel;
