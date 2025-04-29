import {AlertTriangle} from "lucide-react";

interface Props {
    isOpen: boolean;
    itemName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDeleteModal = ({
    isOpen,
    itemName,
    onConfirm,
    onCancel
}: Props) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-red-100 rounded-full p-3">
                        <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Delete {itemName}</h3>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-sm text-gray-500">
                        Are you sure you want to delete this {itemName.toLowerCase()}? This action cannot be undone.
                    </p>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
