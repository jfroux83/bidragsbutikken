import React from "react";
import {AlertTriangle} from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmationDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    type = 'danger'
}: Props) => {

    if (!isOpen) return null;

    const colors = {
        danger: {
            icon: 'text-red-600',
            button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
            iconBg: 'bg-red-100'
        },
        warning: {
            icon: 'text-yellow-600',
            button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
            iconBg: 'bg-yellow-100'
        },
        info: {
            icon: 'text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
            iconBg: 'bg-blue-100'
        }
    };

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center"
            onClick={handleBackdropClick}
        >
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                    <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${colors[type].iconBg} sm:mx-0 sm:h-10 sm:w-10`}>
                        <AlertTriangle className={`h-6 w-6 ${colors[type].icon}`} aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                            {title}
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${colors[type].button}`}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </button>
                    <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationDialog;
